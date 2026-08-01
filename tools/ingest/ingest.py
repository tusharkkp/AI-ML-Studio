import os
import json
import traceback

try:
    import fitz  # PyMuPDF
    HAS_FITZ = True
except ImportError:
    HAS_FITZ = False
    try:
        import pypdf
        HAS_PYPDF = True
    except ImportError:
        HAS_PYPDF = False

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT_DIR = os.path.join(ROOT_DIR, "tools", "ingest", "out")
os.makedirs(OUT_DIR, exist_ok=True)

UNIT_DIRS = [
    "Unit 1",
    "UNIT II",
    "UNIT III Machine Learning Fundamentals",
    "UNIT IV INSTANCES AND PROBABILISTIC MODEL",
    "UNIT V LINEAR AND DECISION MODELS"
]

def extract_pdf(pdf_path, max_pages=None):
    text_chunks = []
    page_count = 0
    try:
        if HAS_FITZ:
            doc = fitz.open(pdf_path)
            page_count = len(doc)
            pages_to_read = min(page_count, max_pages) if max_pages else page_count
            for i in range(pages_to_read):
                page_text = doc[i].get_text()
                if page_text.strip():
                    text_chunks.append(f"--- PAGE {i+1} ---\n{page_text}")
            doc.close()
        elif HAS_PYPDF:
            reader = pypdf.PdfReader(pdf_path)
            page_count = len(reader.pages)
            pages_to_read = min(page_count, max_pages) if max_pages else page_count
            for i in range(pages_to_read):
                page_text = reader.pages[i].extract_text() or ""
                if page_text.strip():
                    text_chunks.append(f"--- PAGE {i+1} ---\n{page_text}")
    except Exception as e:
        text_chunks.append(f"ERROR EXTRACTING PDF: {e}")
    return page_count, "\n".join(text_chunks)

def extract_ipynb(ipynb_path):
    try:
        with open(ipynb_path, "r", encoding="utf-8", errors="ignore") as f:
            nb = json.load(f)
        cells = nb.get("cells", [])
        extracted = []
        for idx, cell in enumerate(cells):
            cell_type = cell.get("cell_type", "unknown")
            source = "".join(cell.get("source", []))
            extracted.append(f"--- CELL {idx+1} [{cell_type}] ---\n{source}\n")
        return len(cells), "\n".join(extracted)
    except Exception as e:
        return 0, f"ERROR EXTRACTING IPYNB: {e}"

def extract_text_file(txt_path):
    try:
        with open(txt_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()
    except Exception as e:
        return f"ERROR EXTRACTING TEXT: {e}"

def extract_csv_summary(csv_path):
    try:
        with open(csv_path, "r", encoding="utf-8", errors="ignore") as f:
            lines = [f.readline() for _ in range(6)]
        return f"HEADER & FIRST 5 ROWS:\n" + "".join(lines)
    except Exception as e:
        return f"ERROR EXTRACTING CSV: {e}"

def main():
    inventory = []
    print("Starting ingestion...")

    for unit in UNIT_DIRS:
        unit_path = os.path.join(ROOT_DIR, unit)
        if not os.path.exists(unit_path):
            print(f"Directory missing: {unit_path}")
            continue

        unit_slug = unit.replace(" ", "_").replace("UNIT_", "Unit_")
        unit_out_dir = os.path.join(OUT_DIR, unit_slug)
        os.makedirs(unit_out_dir, exist_ok=True)

        for root, dirs, filenames in os.walk(unit_path):
            for filename in filenames:
                full_path = os.path.join(root, filename)
                rel_path = os.path.relpath(full_path, ROOT_DIR)
                size_bytes = os.path.getsize(full_path)
                ext = os.path.splitext(filename)[1].lower()

                item = {
                    "unit": unit,
                    "filename": filename,
                    "rel_path": rel_path.replace("\\", "/"),
                    "size_bytes": size_bytes,
                    "type": ext,
                    "extracted_path": None,
                    "item_count": 0,
                    "is_reference_book": False
                }

                # Check if it's one of the large reference textbooks
                if "RusselAndNorving" in filename or "RichAndKnight" in filename:
                    item["is_reference_book"] = True
                    # Extract first 30 pages (TOC & preface) to avoid huge text dumps while preserving copyright bounds
                    page_cnt, txt = extract_pdf(full_path, max_pages=30)
                    item["item_count"] = page_cnt
                    out_filename = f"{filename}.txt"
                    out_filepath = os.path.join(unit_out_dir, out_filename)
                    with open(out_filepath, "w", encoding="utf-8") as f:
                        f.write(f"REFERENCE TEXTBOOK (EXTRACTED TOC/PREFACE ONLY FOR AUDIT - {page_cnt} total pages):\n\n" + txt)
                    item["extracted_path"] = os.path.relpath(out_filepath, ROOT_DIR).replace("\\", "/")
                elif ext == ".pdf":
                    page_cnt, txt = extract_pdf(full_path)
                    item["item_count"] = page_cnt
                    out_filename = f"{filename}.txt"
                    out_filepath = os.path.join(unit_out_dir, out_filename)
                    with open(out_filepath, "w", encoding="utf-8") as f:
                        f.write(txt)
                    item["extracted_path"] = os.path.relpath(out_filepath, ROOT_DIR).replace("\\", "/")
                elif ext == ".ipynb":
                    cell_cnt, txt = extract_ipynb(full_path)
                    item["item_count"] = cell_cnt
                    out_filename = f"{filename}.txt"
                    out_filepath = os.path.join(unit_out_dir, out_filename)
                    with open(out_filepath, "w", encoding="utf-8") as f:
                        f.write(txt)
                    item["extracted_path"] = os.path.relpath(out_filepath, ROOT_DIR).replace("\\", "/")
                elif ext in [".pl", ".py", ".txt"]:
                    txt = extract_text_file(full_path)
                    out_filename = f"{filename}.txt"
                    out_filepath = os.path.join(unit_out_dir, out_filename)
                    with open(out_filepath, "w", encoding="utf-8") as f:
                        f.write(txt)
                    item["extracted_path"] = os.path.relpath(out_filepath, ROOT_DIR).replace("\\", "/")
                elif ext == ".csv":
                    summary = extract_csv_summary(full_path)
                    out_filename = f"{filename}.summary.txt"
                    out_filepath = os.path.join(unit_out_dir, out_filename)
                    with open(out_filepath, "w", encoding="utf-8") as f:
                        f.write(summary)
                    item["extracted_path"] = os.path.relpath(out_filepath, ROOT_DIR).replace("\\", "/")
                
                inventory.append(item)

    inv_path = os.path.join(OUT_DIR, "inventory.json")
    with open(inv_path, "w", encoding="utf-8") as f:
        json.dump(inventory, f, indent=2)

    print(f"Ingestion complete. Processed {len(inventory)} items. Inventory written to {inv_path}")

if __name__ == "__main__":
    main()

