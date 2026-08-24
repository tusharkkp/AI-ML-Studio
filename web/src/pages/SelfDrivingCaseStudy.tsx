import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SelfDrivingLab } from '@/labs/self-driving/SelfDrivingLab';
import { Link } from 'react-router-dom';

export function SelfDrivingCaseStudy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-warm-500">
        <Link to="/learn/unit-1" className="hover:text-warm-800 dark:hover:text-warm-200">
          Unit 1: Basics of AI
        </Link>
        <span>/</span>
        <span className="text-warm-900 dark:text-warm-100 font-semibold">
          Case Study: Self-Driving Vehicle
        </span>
      </nav>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="unit" unit={1}>
            Case Study 2
          </Badge>
          <Badge variant="default">Autonomous Agent Robotics &bull; 1.0 Hour</Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-warm-950 dark:text-warm-50 tracking-tight font-serif">
          Case Study: The Self-Driving Vehicle Perception-Action Loop
        </h1>
        <p className="text-lg text-warm-600 dark:text-warm-400 font-sans leading-relaxed">
          How autonomous vehicles fuse optical cameras, LiDAR point clouds, and millimeter-wave
          radar to navigate noisy, dynamic urban traffic while arbitrating critical safety rules in
          milliseconds.
        </p>
      </header>

      {/* 1. PEAS Decomposition */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          PEAS Framework for Autonomous Vehicles
        </h2>
        <p className="text-warm-700 dark:text-warm-300 leading-relaxed text-sm">
          Recall the PEAS formalization from Topic 2.04. An autonomous vehicle is one of the most
          complex cyber-physical agents in existence:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <Card className="p-4 border-warm-200 dark:border-warm-800">
            <span className="font-bold uppercase text-accent-primary">Performance Measure</span>
            <ul className="mt-1 space-y-1 list-disc pl-4 text-warm-600 dark:text-warm-400">
              <li>Safety: Zero collisions with pedestrians, vehicles, or barriers.</li>
              <li>Compliance: Strict adherence to traffic signals and speed limits.</li>
              <li>Passenger Comfort: Minimize abrupt jerk and lateral acceleration.</li>
              <li>Trip Efficiency: Minimize transit duration and fuel/battery usage.</li>
            </ul>
          </Card>

          <Card className="p-4 border-warm-200 dark:border-warm-800">
            <span className="font-bold uppercase text-accent-primary">Environment</span>
            <ul className="mt-1 space-y-1 list-disc pl-4 text-warm-600 dark:text-warm-400">
              <li>Partially observable: Blind spots, occluded intersections, adverse fog.</li>
              <li>Stochastic: Erratic pedestrian crossings, unpredictable drivers.</li>
              <li>Continuous: Infinitely variable speeds, steering angles, and distances.</li>
              <li>Multi-agent: Competitive, cooperative, and communicative traffic.</li>
            </ul>
          </Card>

          <Card className="p-4 border-warm-200 dark:border-warm-800">
            <span className="font-bold uppercase text-accent-primary">Actuators</span>
            <ul className="mt-1 space-y-1 list-disc pl-4 text-warm-600 dark:text-warm-400">
              <li>Drive-by-wire Electronic Throttle (+0% to +100%).</li>
              <li>Electro-hydraulic Antilock Braking System (ABS / AEB).</li>
              <li>Electric Power Steering rack (-30° to +30° wheel angle).</li>
              <li>Turn signals, horn, hazard lights, and cabin display.</li>
            </ul>
          </Card>

          <Card className="p-4 border-warm-200 dark:border-warm-800">
            <span className="font-bold uppercase text-accent-primary">Sensors</span>
            <ul className="mt-1 space-y-1 list-disc pl-4 text-warm-600 dark:text-warm-400">
              <li>High-resolution RGB Optical Cameras (360° coverage).</li>
              <li>Solid-state or spinning LiDAR (precision 3D point clouds).</li>
              <li>Millimeter-Wave Radar (Doppler velocity &amp; weather penetration).</li>
              <li>Inertial Measurement Unit (IMU), wheel encoders, and RTK-GPS.</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* 2. Interactive Simulator */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
            Interactive Sensor Fusion &amp; Control Lab
          </h2>
          <Badge variant="unit" unit={1}>
            Multi-Sensor Loop
          </Badge>
        </div>
        <p className="text-sm text-warm-600 dark:text-warm-400">
          Simulate autonomous emergency braking (AEB), test heavy fog sensor degradation to see
          radar rescue the vehicle, and experience the physical limits of braking distance.
        </p>

        <SelfDrivingLab />
      </section>

      {/* 3. Sensor Fusion Imperative */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          The Sensor Fusion Imperative: Why One Sensor Is Never Enough
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <Card className="p-4 border-cyan-200 dark:border-cyan-800 bg-cyan-50/40 dark:bg-cyan-950/20">
            <h4 className="font-bold text-cyan-900 dark:text-cyan-100 mb-1">Optical Cameras</h4>
            <p className="text-warm-600 dark:text-warm-400 mb-2">
              <strong>Superpower:</strong> High-resolution semantic understanding: reads road text,
              traffic light colors, and painted lane lines.
            </p>
            <p className="text-rose-600 dark:text-rose-400 font-medium">
              <strong>Blindspot:</strong> Struggles with direct sun glare, heavy rain, thick fog,
              and lacks direct depth measurement.
            </p>
          </Card>

          <Card className="p-4 border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-100 mb-1">
              LiDAR (Light Detection &amp; Ranging)
            </h4>
            <p className="text-warm-600 dark:text-warm-400 mb-2">
              <strong>Superpower:</strong> Emits millions of laser pulses per second to generate
              exact sub-centimeter 3D geometric meshes of the world.
            </p>
            <p className="text-rose-600 dark:text-rose-400 font-medium">
              <strong>Blindspot:</strong> Expensive hardware ($1,000–$10,000); laser pulses scatter
              in heavy fog, snow, or airborne dust.
            </p>
          </Card>

          <Card className="p-4 border-amber-200 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20">
            <h4 className="font-bold text-amber-900 dark:text-amber-100 mb-1">
              Millimeter-Wave Radar
            </h4>
            <p className="text-warm-600 dark:text-warm-400 mb-2">
              <strong>Superpower:</strong> 77 GHz electromagnetic waves effortlessly penetrate fog,
              rain, and blizzards; directly measures relative Doppler speed.
            </p>
            <p className="text-rose-600 dark:text-rose-400 font-medium">
              <strong>Blindspot:</strong> Low spatial resolution; cannot classify whether an object
              is a human, a trash can, or a cardboard box.
            </p>
          </Card>
        </div>
      </section>

      {/* 4. SAE Levels of Automation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          SAE J3016: The 5 Levels of Driving Automation
        </h2>
        <div className="overflow-x-auto border border-warm-200 dark:border-warm-800 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-warm-100 dark:bg-warm-800 text-warm-700 dark:text-warm-300">
              <tr>
                <th className="p-2.5">Level</th>
                <th className="p-2.5">Name</th>
                <th className="p-2.5">Driver Role</th>
                <th className="p-2.5">Steering &amp; Speed</th>
                <th className="p-2.5">Fallback Responsibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-200 dark:divide-warm-800 text-warm-700 dark:text-warm-300">
              <tr>
                <td className="p-2 font-bold font-mono">Level 0</td>
                <td className="p-2">No Automation</td>
                <td className="p-2">Continuous control</td>
                <td className="p-2">Human</td>
                <td className="p-2">Human</td>
              </tr>
              <tr>
                <td className="p-2 font-bold font-mono">Level 1</td>
                <td className="p-2">Driver Assistance</td>
                <td className="p-2">Continuous supervision</td>
                <td className="p-2">System (Speed OR Steer)</td>
                <td className="p-2">Human</td>
              </tr>
              <tr>
                <td className="p-2 font-bold font-mono">Level 2</td>
                <td className="p-2">Partial Automation (Tesla Autopilot)</td>
                <td className="p-2">Eyes on road, hands on wheel</td>
                <td className="p-2">System (Speed AND Steer)</td>
                <td className="p-2">Human (Immediate Takeover)</td>
              </tr>
              <tr className="bg-amber-50/60 dark:bg-amber-950/20">
                <td className="p-2 font-bold font-mono text-amber-700">Level 3</td>
                <td className="p-2 font-semibold">Conditional Automation (Mercedes Drive Pilot)</td>
                <td className="p-2">Eyes off road, must take over on alert</td>
                <td className="p-2">System in defined ODD</td>
                <td className="p-2 text-amber-700 font-bold">Human when requested</td>
              </tr>
              <tr className="bg-emerald-50/60 dark:bg-emerald-950/20">
                <td className="p-2 font-bold font-mono text-emerald-700">Level 4</td>
                <td className="p-2 font-semibold">High Automation (Waymo Robotaxi)</td>
                <td className="p-2">Passenger only (no driver required)</td>
                <td className="p-2">System within geofenced city</td>
                <td className="p-2 text-emerald-700 font-bold">System handles fallback</td>
              </tr>
              <tr>
                <td className="p-2 font-bold font-mono">Level 5</td>
                <td className="p-2">Full Automation</td>
                <td className="p-2">No pedals or steering wheel</td>
                <td className="p-2">System in all conditions globally</td>
                <td className="p-2">System completely</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. The Moral Machine Dilemma */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          The Moral Machine: When Physical Rules Conflict
        </h2>
        <Card className="p-5 border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20 space-y-3">
          <h4 className="font-bold text-amber-900 dark:text-amber-200">
            The Autonomous Trolley Problem
          </h4>
          <p className="text-xs text-warm-700 dark:text-warm-300 leading-relaxed">
            Consider an unavoidable emergency: a large freight truck loses control ahead on a
            mountain pass. The vehicle can:
          </p>
          <ul className="text-xs space-y-1 list-disc pl-5 text-warm-700 dark:text-warm-300">
            <li>Option A: Stay in lane and collide with the truck (killing the passenger).</li>
            <li>Option B: Swerve onto the pedestrian sidewalk (killing 2 pedestrians).</li>
            <li>Option C: Swerve off the cliff edge.</li>
          </ul>
          <p className="text-xs text-warm-700 dark:text-warm-300 leading-relaxed font-semibold">
            How do you write a utility function for human lives? Who decides the weights: the
            passenger, the automaker, or the government? These questions bridge Unit 1 technical
            architectures directly into Ethical Considerations.
          </p>
        </Card>
      </section>

      {/* 6. Summary and Navigation */}
      <section className="space-y-4 pt-4 border-t border-warm-200 dark:border-warm-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-semibold text-warm-500">Next Topic</span>
            <h3 className="text-lg font-bold text-warm-900 dark:text-warm-100">
              Impact &amp; Ethical Concerns of AI
            </h3>
            <p className="text-xs text-warm-600 dark:text-warm-400">
              Explore demographic bias, algorithmic discrimination, copyright in generative AI, and
              safety governance frameworks.
            </p>
          </div>
          <Link to="/learn/unit-1/ethics-impact">
            <Button variant="primary">Continue to Ethics &amp; Impact &rarr;</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
