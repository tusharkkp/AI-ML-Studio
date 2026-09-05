import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Callout } from '@/components/ui/Callout';
import { Quiz } from '@/features/quiz/Quiz';
import { GpsNavigationLab } from '@/labs/gps-navigation/GpsNavigationLab';
import { ArrowLeft } from 'lucide-react';

export function GpsNavigationCaseStudyPage() {
  const [showMath, setShowMath] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<string | null>(null);

  const quizItems = [
    {
      id: 'gps-q1',
      question:
        'Why cannot production GPS mapping systems like Google Maps run raw Dijkstra algorithm on the global road graph?',
      options: [
        {
          id: 'A',
          text: 'The global road graph contains hundreds of millions of road segments; exploring in uniform circles would take minutes and consume gigabytes of memory per query.',
          isCorrect: true,
          explanation:
            'With over 50 million road intersections across continental networks, raw Dijkstra search visits millions of irrelevant nodes in all directions before reaching a distant destination, resulting in seconds of latency. Production engines combine A* with precomputed Contraction Hierarchies to answer queries in milliseconds.',
        },
        {
          id: 'B',
          text: 'Dijkstra algorithm is mathematically unable to handle one-way streets.',
          isCorrect: false,
          explanation: 'Dijkstra works fine on directed graphs, but suffers from sheer combinatorial explosion.',
        },
        {
          id: 'C',
          text: 'GPS satellites forbid running Dijkstra algorithms due to frequency interference.',
          isCorrect: false,
          explanation: 'Satellites do not execute routing algorithms; they broadcast atomic timestamps.',
        },
      ],
    },
    {
      id: 'gps-q2',
      question:
        'When computing driving time rather than physical distance, how must the heuristic h(n) be formulated to maintain admissibility?',
      options: [
        {
          id: 'A',
          text: 'h(n) = (Straight-line Euclidean or Haversine distance) / (Maximum legal speed limit on the fastest highway network).',
          isCorrect: true,
          explanation:
            'To remain admissible, h(n) must never overestimate the true remaining travel time. Dividing the minimum possible geographic distance by the highest attainable legal speed (e.g. 120 km/h on expressways) yields an optimistic lower bound on travel time.',
        },
        {
          id: 'B',
          text: 'h(n) = (Physical distance) * (Average city traffic speed).',
          isCorrect: false,
          explanation: 'Multiplying distance by speed produces dimensionally invalid units (km * km/h).',
        },
        {
          id: 'C',
          text: 'h(n) must always be set to zero.',
          isCorrect: false,
          explanation: 'Setting h=0 is admissible but reduces A* to Dijkstra, destroying the directional heuristic pruning.',
        },
      ],
    },
    {
      id: 'gps-q3',
      question:
        'What technique enables modern navigation engines like OSRM to answer point-to-point queries in under 5 milliseconds on continental graphs?',
      options: [
        {
          id: 'A',
          text: 'Contraction Hierarchies (CH), which precompute shortcut edges bypassing low-importance local streets.',
          isCorrect: true,
          explanation:
            'Storing all-pairs shortest paths for 50 million nodes would require quadrillions of entries (petabytes of storage). Contraction Hierarchies hierarchically order nodes by importance, adding shortcut edges so queries only search upward through important arterial highways, reducing search spaces to a few hundred nodes.',
        },
        {
          id: 'B',
          text: 'Replacing all search algorithms with linear regression.',
          isCorrect: false,
          explanation: 'Linear regression cannot find topological paths on complex graphs.',
        },
        {
          id: 'C',
          text: 'Storing the precomputed shortest path between every pair of intersections in a static lookup table.',
          isCorrect: false,
          explanation: 'All-pairs lookup tables for 50M nodes require petabytes of storage, which is intractable.',
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-12">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          to="/learn/unit-2"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Unit 2 Directory
        </Link>
        <span className="text-neutral-600">/</span>
        <span className="text-xs font-mono text-neutral-300">Case Study 1: GPS Navigation</span>
      </div>

      {/* Hero Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">Unit 2: Case Study 1</Badge>
          <Badge variant="default">Real-World Engineering</Badge>
          <Badge variant="unit">CO1, CO2, CO4</Badge>
        </div>
        <h1 className="font-montserrat text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Case Study 1: GPS Navigation & Route Planning
        </h1>
        <p className="text-base text-neutral-300 leading-relaxed max-w-3xl">
          Discover how real-world navigation engines scale A* search across{' '}
          <span className="font-montserrat text-highlight font-semibold">
            continental road graphs
          </span>{' '}
          with dynamic live traffic updates and millisecond query latency.
        </p>
      </div>

      {/* Section 1: Intuition & The "Aha!" Moment */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          1. Intuition: Why Pure Dijkstra Crumbles at Scale
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed text-sm text-neutral-300">
          <div className="p-5 rounded-2xl border border-card-edge bg-card-fill/60 space-y-3">
            <h3 className="font-montserrat text-base font-semibold text-foreground">
              The 50-Million Node Dilemma
            </h3>
            <p>
              When you ask your phone for directions from Pune to Nanded, you are querying a road
              network containing over 20 million road segments across India. If your routing engine
              uses Dijkstra algorithm, it expands like an inflating balloon, meticulously inspecting
              every single alleyway and dirt road in Goa, Gujarat, and Karnataka before reaching
              your destination in Marathwada.
            </p>
            <p>
              Dijkstra guarantees the shortest path, but wasting computational cycles exploring
              residential lanes 300 km in the opposite direction is unacceptable for live
              navigation.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-card-edge bg-card-fill/60 space-y-3">
            <h3 className="font-montserrat text-base font-semibold text-foreground">
              The Geographic Ellipse
            </h3>
            <p>
              By equipping the search engine with a{' '}
              <span className="font-montserrat text-highlight font-semibold">
                great-circle Haversine heuristic
              </span>
              , A* pulls the search frontier directly along the geographic corridor connecting the
              origin and destination.
            </p>
            <p>
              Instead of an expanding circle that blankets thousands of square kilometers, A* forms
              a narrow, focused ellipse aimed straight at the goal. Combined with bidirectional
              search and highway hierarchies, queries that previously took 10 seconds complete in
              less than 5 milliseconds.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Interactive Lab */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          2. Interactive Lab: Maharashtra Regional GPS Route Planner
        </h2>
        <p className="text-sm text-neutral-300 leading-relaxed">
          Test real-time routing between major commercial hubs in Maharashtra. Contrast the node
          exploration footprint of A* against Dijkstra, and trigger a monsoon expressway blockage to
          watch the engine compute real-time dynamic rerouting.
        </p>
        <GpsNavigationLab />
      </section>

      {/* Section 3: Predict-Then-Reveal Challenge */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          3. Predict-Then-Reveal: The Expressway Landslide
        </h2>
        <Card className="p-6 border-card-edge bg-card-fill">
          <p className="text-sm text-neutral-200 leading-relaxed mb-4">
            Suppose you plan a trip from{' '}
            <span className="font-montserrat text-highlight font-semibold">Mumbai to Nanded</span>.
            Under normal traffic, the optimal path is Mumbai &rarr; Pune &rarr; Ahmednagar &rarr;
            Chh. Sambhajinagar &rarr; Nanded. What happens to the route when an active landslide
            blocks the Mumbai-Pune Expressway with a +350% delay?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <button
              onClick={() => setPrediction('nashik')}
              className={`p-3 rounded-xl border text-xs text-left transition-colors ${
                prediction === 'nashik'
                  ? 'border-brand bg-brand/10 text-foreground font-semibold'
                  : 'border-card-edge bg-card-fill/60 text-neutral-400 hover:text-foreground'
              }`}
            >
              <strong>A) Reroutes via Nashik</strong> (Mumbai &rarr; Nashik &rarr; Chh.
              Sambhajinagar &rarr; Nanded), completely bypassing Pune.
            </button>

            <button
              onClick={() => setPrediction('pune')}
              className={`p-3 rounded-xl border text-xs text-left transition-colors ${
                prediction === 'pune'
                  ? 'border-brand bg-brand/10 text-foreground font-semibold'
                  : 'border-card-edge bg-card-fill/60 text-neutral-400 hover:text-foreground'
              }`}
            >
              <strong>B) Remains stuck on Pune route</strong> because A* cannot modify precomputed
              paths.
            </button>

            <button
              onClick={() => setPrediction('kolhapur')}
              className={`p-3 rounded-xl border text-xs text-left transition-colors ${
                prediction === 'kolhapur'
                  ? 'border-brand bg-brand/10 text-foreground font-semibold'
                  : 'border-card-edge bg-card-fill/60 text-neutral-400 hover:text-foreground'
              }`}
            >
              <strong>C) Reroutes south via Satara and Kolhapur</strong> adding 400 km.
            </button>
          </div>

          {prediction && (
            <Callout
              type={prediction === 'nashik' ? 'tip' : 'warning'}
              title={
                prediction === 'nashik'
                  ? 'Prediction Verified!'
                  : 'Inspect the Dynamic Cost Multipliers'
              }
            >
              {prediction === 'nashik' ? (
                <p className="text-xs text-neutral-300">
                  Spot on! With the Expressway edge inflated from 150 km to 525 km equivalent due to
                  severe congestion, the Nashik highway corridor (165 km to Nashik + 180 km to Chh.
                  Sambhajinagar = 345 km) becomes significantly cheaper than going through Pune (525
                  + 120 + 115 = 760 km). A* detects the change on its open set and pivots seamlessly
                  through Nashik!
                </p>
              ) : (
                <p className="text-xs text-neutral-300">
                  Because A* computes routes dynamically over live edge weights, inflating the
                  Mumbai-Pune link by 350% causes the northern arterial route through Nashik (NH 160
                  / Samruddhi Mahamarg corridor) to emerge as the strictly lower-cost path.
                </p>
              )}
            </Callout>
          )}
        </Card>
      </section>

      {/* Section 4: Step-by-Step on Paper */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          4. Step-by-Step on Paper: Geographic Haversine Distance
        </h2>
        <Card className="p-6 border-card-edge bg-card-fill space-y-4 text-sm text-neutral-300 leading-relaxed">
          <p>
            On a spherical Earth, Euclidean plane distance fails over long journeys. GPS navigation
            systems compute the great-circle distance between coordinates (φ₁, λ₁) and (φ₂, λ₂)
            using the Haversine formula:
          </p>

          <div className="p-4 rounded-xl border border-card-edge bg-neutral-900/60 font-mono text-xs text-neutral-300 space-y-2 text-center">
            <p>{'a = sin²(Δφ / 2) + cos(φ₁) · cos(φ₂) · sin²(Δλ / 2)'}</p>
            <p>{'c = 2 · atan2(√a, √(1 - a))'}</p>
            <p className="text-brand font-bold">{'d = R · c   (Earth mean radius R ≈ 6,371 km)'}</p>
          </div>

          <p className="text-xs text-neutral-400">
            Because a straight great-circle arc through 3D space is the strictly shortest possible
            distance between two points on a globe, the Haversine distance is{' '}
            <span className="font-montserrat text-highlight font-semibold">
              provably admissible
            </span>
            : it can never overestimate the actual driving distance along the winding road network.
          </p>
        </Card>
      </section>

      {/* Section 5: Formal Mathematical Foundations */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-montserrat text-2xl font-semibold text-foreground">
            5. Formal Mathematical Foundations
          </h2>
          <Button size="sm" variant="outline" onClick={() => setShowMath((prev) => !prev)}>
            {showMath ? 'Hide Advanced Architecture' : 'Show Advanced Architecture'}
          </Button>
        </div>

        <div className="space-y-4 text-sm text-neutral-300 leading-relaxed">
          <div className="p-5 rounded-xl border border-card-edge bg-card-fill/60 space-y-2">
            <h3 className="font-montserrat text-base font-semibold text-foreground">
              Road Graphs as Directed Multigraphs
            </h3>
            <p>
              A transport network is modeled as a directed weighted graph G = (V, E, w), where
              vertices V represent junctions and road endpoints, directed edges E represent travel
              lanes (respecting one-way restrictions, turn prohibitions, and overpass flyovers), and
              weight function w: E × T &rarr; ℝ⁺ maps each edge to its travel time at time T.
            </p>
          </div>

          {showMath && (
            <div className="p-5 rounded-xl border border-brand/30 bg-card-fill space-y-4 text-xs font-mono">
              <h3 className="font-montserrat text-sm font-semibold text-foreground">
                Industrial Acceleration: Contraction Hierarchies (CH)
              </h3>
              <p>To achieve sub-millisecond query performance on continent-scale graphs:</p>
              <div className="space-y-2 text-neutral-300 pl-4 border-l-2 border-brand">
                <p>
                  1. <strong>Preprocessing Phase:</strong> Every node v ∈ V is assigned a
                  hierarchical importance rank based on edge difference and contracted shortcuts.
                  Nodes of low rank (cul-de-sacs, residential driveways) are bypassed by adding
                  shortcut edges between their neighbors.
                </p>
                <p>
                  2. <strong>Query Phase:</strong> Bidirectional search is executed where the
                  forward search from the origin only traverses edges to higher-ranked nodes, and
                  the backward search from the destination similarly only traverses edges to
                  higher-ranked nodes.
                </p>
                <p>
                  3. <strong>Optimality Guarantee:</strong> Both search frontiers meet at the
                  highest-ranked node on the shortest path (the major interstate highway), reducing
                  the search space from millions of nodes down to mere hundreds.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Section 6: Algorithm Pseudocode */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          6. Algorithm Pseudocode: Bidirectional A* with Traffic Weights
        </h2>
        <Card className="p-4 border-card-edge bg-[#0a0a0a] font-mono text-xs text-neutral-300 overflow-x-auto">
          <pre className="leading-relaxed">
            {`function BIDIRECTIONAL_ASTAR(origin, destination, live_traffic_graph):
    forward_queue = PriorityQueue()
    backward_queue = PriorityQueue()
    
    forward_queue.push(origin, priority=haversine(origin, destination))
    backward_queue.push(destination, priority=haversine(destination, origin))
    
    g_forward = { origin: 0 }
    g_backward = { destination: 0 }
    best_connection = None
    min_total_cost = infinity

    while not forward_queue.empty() and not backward_queue.empty():
        // Expand forward search
        curr_f = forward_queue.pop_min()
        for neighbor, edge in live_traffic_graph.outgoing(curr_f):
            tentative = g_forward[curr_f] + edge.travel_time()
            if tentative < g_forward.get(neighbor, infinity):
                g_forward[neighbor] = tentative
                forward_queue.push(neighbor, tentative + haversine(neighbor, destination))
                if neighbor in g_backward:
                    total = tentative + g_backward[neighbor]
                    if total < min_total_cost:
                        min_total_cost = total
                        best_connection = neighbor

        // Check meeting termination criterion
        if forward_queue.min_f() + backward_queue.min_f() >= min_total_cost:
            return reconstruct_bidirectional_path(best_connection)`}
          </pre>
        </Card>
      </section>

      {/* Section 7: Code It in Python */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          7. Code It in Python: Real-World Network Routing
        </h2>
        <Card className="p-4 border-card-edge bg-[#0a0a0a] font-mono text-xs text-neutral-300 overflow-x-auto">
          <pre className="leading-relaxed">
            {`import math
import heapq
from typing import Dict, Tuple, List, Optional

def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Great-circle distance between two GPS coordinates in kilometers."""
    r = 6371.0  # Earth mean radius in km
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = math.sin(dphi / 2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2)**2
    return 2 * r * math.atan2(math.sqrt(a), math.sqrt(1 - a))

def route_planner_astar(
    graph: Dict[str, List[Tuple[str, float]]],
    coords: Dict[str, Tuple[float, float]],
    origin: str,
    destination: str
) -> Optional[List[str]]:
    """A* route calculation with Haversine distance heuristic."""
    dest_lat, dest_lon = coords[destination]
    
    def h(city: str) -> float:
        lat, lon = coords[city]
        return haversine_km(lat, lon, dest_lat, dest_lon)

    open_heap = [(h(origin), 0, origin)]
    g_scores = {origin: 0.0}
    parents = {}
    visited = set()

    while open_heap:
        _, cur_g, current = heapq.heappop(open_heap)

        if current == destination:
            path = [current]
            while current in parents:
                current = parents[current]
                path.append(current)
            return path[::-1]

        if current in visited:
            continue
        visited.add(current)

        for neighbor, edge_weight in graph.get(current, []):
            if neighbor in visited:
                continue

            tentative_g = cur_g + edge_weight
            if tentative_g < g_scores.get(neighbor, float('inf')):
                parents[neighbor] = current
                g_scores[neighbor] = tentative_g
                f_cost = tentative_g + h(neighbor)
                heapq.heappush(open_heap, (f_cost, tentative_g, neighbor))

    return None`}
          </pre>
        </Card>
      </section>

      {/* Section 8: "Make It Fail" Laboratory */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          8. "Make It Fail" Laboratory: Edge-Case Failure Modes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
          <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-2">
            <h3 className="font-montserrat text-sm font-semibold text-rose-300">
              Failure Mode 1: Static Precomputing vs Live Flash Floods
            </h3>
            <p className="text-neutral-300">
              Contraction Hierarchies precompute shortcuts based on historic average speeds. When
              sudden flash flooding washes out a bridge, static shortcuts that bypass the bridge
              become corrupted, causing the router to send motorists straight into the flooded zone
              unless dynamic hierarchy updates are triggered.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 space-y-2">
            <h3 className="font-montserrat text-sm font-semibold text-amber-300">
              Failure Mode 2: The Residential Shortcuts Trap (Waze Effect)
            </h3>
            <p className="text-neutral-300">
              When arterial highways slow down by 5%, naive cost minimization routes thousands of
              cars through narrow residential side streets. The sudden influx causes gridlock on
              roads never engineered for high throughput, turning a 1-minute theoretical savings
              into a 30-minute traffic jam.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: Strengths, Limitations & When NOT to Use */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          9. Strengths, Limitations & When NOT to Use
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed">
          <div className="p-4 rounded-xl border border-card-edge bg-card-fill/60 space-y-2">
            <h3 className="font-montserrat text-sm font-semibold text-emerald-400">Strengths</h3>
            <ul className="list-disc pl-4 space-y-1.5 text-neutral-300">
              <li>
                <span className="font-montserrat text-highlight font-semibold">
                  Sub-millisecond query speed
                </span>{' '}
                when augmented with Contraction Hierarchies.
              </li>
              <li>
                Accurately handles real-world road graph complexities (turn costs, toll gates,
                vehicle dimensions).
              </li>
              <li>
                Seamless integration with real-time telemetry from smartphone sensors and traffic
                cameras.
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-card-edge bg-card-fill/60 space-y-2">
            <h3 className="font-montserrat text-sm font-semibold text-rose-400">Limitations</h3>
            <ul className="list-disc pl-4 space-y-1.5 text-neutral-300">
              <li>
                Heavy preprocessing: building contraction hierarchies across continental networks
                takes hours of cloud compute.
              </li>
              <li>
                Dynamic weight updates require complex repair algorithms (Customizable Contraction
                Hierarchies).
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-card-edge bg-card-fill/60 space-y-2">
            <h3 className="font-montserrat text-sm font-semibold text-amber-400">
              When NOT to Use
            </h3>
            <ul className="list-disc pl-4 space-y-1.5 text-neutral-300">
              <li>
                When edge weights change continuously every few seconds across 100% of the network
                (e.g. ad-hoc drone mesh networks).
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 10: Common Misconceptions */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          10. Common Misconceptions
        </h2>
        <div className="space-y-3 text-xs leading-relaxed">
          <div className="p-4 rounded-xl border border-card-edge bg-card-fill/60 space-y-1">
            <span className="font-semibold text-rose-400 font-montserrat">Misconception 1:</span>
            <p className="text-neutral-300">
              <em>"GPS satellites compute your turn-by-turn driving route."</em>
            </p>
            <p className="text-neutral-400">
              <strong>Reality:</strong> False! GPS satellites are atomic clocks broadcasting radio
              timestamps. Your phone merely listens to 4+ satellites to calculate its latitude and
              longitude. The actual route planning is computed on local device RAM or central cloud
              routing servers using A*.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-card-edge bg-card-fill/60 space-y-1">
            <span className="font-semibold text-rose-400 font-montserrat">Misconception 2:</span>
            <p className="text-neutral-300">
              <em>
                "A* always finds the fastest route regardless of how the heuristic is written."
              </em>
            </p>
            <p className="text-neutral-400">
              <strong>Reality:</strong> If your heuristic estimates travel time by assuming a 40
              km/h city speed limit, but an expressway allows 120 km/h, the heuristic{' '}
              <span className="font-montserrat text-highlight font-semibold">
                overestimates the remaining time
              </span>{' '}
              on the expressway, violating admissibility and leading A* to discard the superior
              expressway in favor of slower rural roads!
            </p>
          </div>
        </div>
      </section>

      {/* Section 11: Check Yourself */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          11. Check Yourself: Micro-Quiz
        </h2>
        <Quiz conceptId="u2-case-gps" items={quizItems} />
      </section>

      {/* Section 12: Production Routing Architectures */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          12. Industrial Infrastructure: OSRM, Valhalla & Google Maps
        </h2>
        <Card className="p-5 border-card-edge bg-card-fill space-y-3 text-xs leading-relaxed text-neutral-300">
          <p>Modern internet mapping platforms employ a multi-tier routing architecture:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-neutral-400">
            <div className="p-3 rounded-lg border border-card-edge bg-neutral-900/50">
              <span className="font-bold text-foreground block mb-1">
                Open Source Routing Machine (OSRM)
              </span>
              Written in C++, OSRM uses Multi-Level Dijkstra (MLD) and Contraction Hierarchies on
              top of OpenStreetMap data. It routinely answers 10,000 routing queries per second on a
              single commodity server.
            </div>
            <div className="p-3 rounded-lg border border-card-edge bg-neutral-900/50">
              <span className="font-bold text-foreground block mb-1">
                Google Maps Traffic Engine
              </span>
              Aggregates anonymous real-time Android GPS telemetry, historical congestion curves,
              and machine learning models (DeepMind Graph Neural Networks) to predict traffic speeds
              up to 60 minutes into the future.
            </div>
          </div>
        </Card>
      </section>

      {/* Section 13: Exam & Viva Corner */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          13. Exam & Viva Corner: University Assessment Prep
        </h2>
        <Card className="p-5 border-card-edge bg-card-fill space-y-4 text-xs leading-relaxed">
          <div className="border-b border-card-edge pb-3 space-y-1">
            <span className="font-mono text-brand font-bold">
              Q1: Formulate the GPS route planning task as a formal State-Space Search problem.
            </span>
            <p className="text-neutral-300">
              <strong>Model Answer:</strong> State space S: all physical road junctions and terminal
              endpoints in the road network. Initial state s₀: the vehicle current GPS coordinates
              mapped to the nearest road segment. Actions A(s): all legal driving turns and
              maneuvers permitted from junction s. Transition model T(s, a): yields the connected
              successor junction. Step cost c(s, a, s'): travel time across road segment (s, s')
              factoring in length, speed limit, and live traffic congestion. Goal test: checking
              whether current junction matches destination coordinates within a threshold radius
              (e.g. 20 meters).
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-brand font-bold">
              Q2: How do one-way streets affect Bidirectional Search in navigation graphs?
            </span>
            <p className="text-neutral-300">
              <strong>Model Answer:</strong> The backward search starting from the destination
              cannot follow outgoing edges of one-way streets. It must traverse edges in the{' '}
              <em>transposed (reversed) graph</em> Gᵀ, following incoming edges backward into
              upstream junctions. Failing to invert edge directions would calculate routes where
              vehicles drive against oncoming traffic on one-way lanes.
            </p>
          </div>
        </Card>
      </section>

      {/* Section 14: Summary & Key Takeaways */}
      <section className="p-6 rounded-2xl border border-card-edge bg-card-fill/60 space-y-3 text-xs leading-relaxed">
        <h2 className="font-montserrat text-lg font-semibold text-foreground">
          14. Summary & Key Takeaways
        </h2>
        <ul className="list-disc pl-4 space-y-1.5 text-neutral-300">
          <li>
            <strong>A* makes navigation tractable:</strong> using straight-line great-circle
            distance as an admissible heuristic focuses exploration along the road corridor.
          </li>
          <li>
            <strong>Dynamic weights adapt to traffic:</strong> real-time congestion and landslides
            modify edge weights on the fly, triggering immediate rerouting around bottlenecks.
          </li>
          <li>
            <strong>Hierarchical scaling:</strong> Contraction Hierarchies and bidirectional search
            reduce query times from seconds to single-digit milliseconds on multi-million node
            graphs.
          </li>
          <li>
            <strong>Course Outcome 2 served:</strong> students understand how foundational AI search
            algorithms power production transportation and logistics infrastructure.
          </li>
        </ul>
      </section>
    </div>
  );
}
