#!/usr/bin/env python3
"""
VPS Monitor - Simple daemon to monitor system health and alert
"""

import os
import time
import json
from datetime import datetime
import psutil

class VPSMonitor:
    def __init__(self, check_interval=60):
        self.check_interval = check_interval
        self.alerts_file = Path.home() / ".vps-monitor" / "alerts.json"
        self.alerts_file.parent.mkdir(parents=True, exist_ok=True)

    def get_system_status(self):
        """Get current system status"""
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        uptime = time.time() - psutil.boot_time()

        return {
            'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            'cpu_percent': cpu_percent,
            'memory_percent': memory.percent,
            'memory_used': memory.used / (1024**3),
            'memory_total': memory.total / (1024**3),
            'disk_percent': disk.percent,
            'disk_used': memory.used / (1024**3),  # Using memory used as example
            'uptime_days': uptime / 86400,
            'hostname': os.uname().nodename
        }

    def check_health(self):
        """Check if system is healthy"""
        status = self.get_system_status()
        alerts = []

        if status['cpu_percent'] > 80:
            alerts.append({
                'type': 'warning',
                'message': f"High CPU usage: {status['cpu_percent']}%",
                'timestamp': status['timestamp']
            })

        if status['memory_percent'] > 90:
            alerts.append({
                'type': 'critical',
                'message': f"High memory usage: {status['memory_percent']}%",
                'timestamp': status['timestamp']
            })

        if status['disk_percent'] > 90:
            alerts.append({
                'type': 'critical',
                'message': f"Low disk space: {status['disk_percent']}%",
                'timestamp': status['timestamp']
            })

        if status['uptime_days'] < 1:
            alerts.append({
                'type': 'warning',
                'message': f"System just restarted (uptime: {status['uptime_days']:.2f} days)",
                'timestamp': status['timestamp']
            })

        return status, alerts

    def save_alert(self, alert):
        """Save alert to file"""
        alerts = self.load_alerts()
        alerts.append(alert)
        with open(self.alerts_file, 'w') as f:
            json.dump(alerts, f, indent=2)

    def load_alerts(self):
        """Load alerts from file"""
        if not self.alerts_file.exists():
            return []
        with open(self.alerts_file, 'r') as f:
            return json.load(f)

    def show_status(self):
        """Show current status"""
        status, alerts = self.check_health()

        print("\n" + "="*50)
        print(f"VPS Monitor - {status['hostname']}")
        print("="*50)
        print(f"CPU:    {status['cpu_percent']}%")
        print(f"Memory: {status['memory_percent']}% ({status['memory_used']:.1f}GB / {status['memory_total']:.1f}GB)")
        print(f"Disk:   {status['disk_percent']}%")
        print(f"Uptime: {status['uptime_days']:.2f} days")
        print("="*50)

        if alerts:
            print("\n⚠️  ALERTS:")
            for alert in alerts:
                emoji = "🚨" if alert['type'] == 'critical' else "⚠️"
                print(f"{emoji} {alert['message']}")
        else:
            print("\n✅ All systems normal")

        return status

def main():
    monitor = VPSMonitor()

    if len(sys.argv) > 1 and sys.argv[1] == '--daemon':
        # Daemon mode - run in background and exit
        print(f"Starting VPS Monitor daemon...")
        while True:
            status, alerts = monitor.check_health()
            if alerts:
                for alert in alerts:
                    monitor.save_alert(alert)
                    # Could send notification here
            time.sleep(monitor.check_interval)
    else:
        # Interactive mode
        print("VPS Monitor - Run in daemon mode: python3 vps-monitor.py --daemon")
        monitor.show_status()

if __name__ == '__main__':
    import sys
    main()
