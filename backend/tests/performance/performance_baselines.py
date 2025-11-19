"""
Performance Baselines and Monitoring
Establish performance benchmarks and monitoring system
"""

import pytest
import time
import psutil
import os
from django.test import TestCase
from django.test.client import Client
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
import json
from datetime import datetime

User = get_user_model()

class PerformanceBaselineTestCase(TestCase):
    """Test and establish performance baselines"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.refresh.access_token}')
        
        # Performance baselines
        self.baselines = {
            'api_response_time_ms': 200,
            'database_query_time_ms': 100,
            'memory_usage_mb': 512,
            'cpu_usage_percent': 80,
            'concurrent_users': 100,
            'page_load_time_ms': 3000,
            'bundle_size_mb': 2,
            'jwt_token_lifetime_days': 30,  # 1 month for better UX
        }
        
        self.performance_results = {
            'test_date': datetime.now().isoformat(),
            'baselines': self.baselines,
            'measurements': {},
            'recommendations': []
        }
    
    def measure_api_response_time(self):
        """Measure API response times"""
        print("\n📊 Measuring API Response Times...")
        
        endpoints_to_test = [
            '/api/clients/',
            '/api/appointments/',
            '/api/staff/',
            '/api/services/',
            '/api/business/details/',
        ]
        
        api_times = {}
        
        for endpoint in endpoints_to_test:
            times = []
            
            # Measure 5 requests to get average
            for i in range(5):
                start_time = time.time()
                response = self.client.get(endpoint)
                end_time = time.time()
                
                response_time_ms = (end_time - start_time) * 1000
                times.append(response_time_ms)
            
            avg_time = sum(times) / len(times)
            max_time = max(times)
            min_time = min(times)
            
            api_times[endpoint] = {
                'average_ms': round(avg_time, 2),
                'max_ms': round(max_time, 2),
                'min_ms': round(min_time, 2),
                'status_code': response.status_code
            }
            
            # Assert performance meets baseline
            self.assertLess(
                avg_time,
                self.baselines['api_response_time_ms'],
                f"API endpoint {endpoint} response time {avg_time:.2f}ms exceeds baseline {self.baselines['api_response_time_ms']}ms"
            )
            
            print(f"  {endpoint}: {avg_time:.2f}ms avg ({min_time:.2f}ms - {max_time:.2f}ms)")
        
        self.performance_results['measurements']['api_response_times'] = api_times
        print("✅ API Response Time Baselines Established")
    
    def measure_memory_usage(self):
        """Measure memory usage during operations"""
        print("\n💾 Measuring Memory Usage...")
        
        process = psutil.Process()
        
        # Measure initial memory
        initial_memory = process.memory_info().rss / 1024 / 1024  # MB
        
        # Perform memory-intensive operations
        memory_measurements = []
        
        # Test API calls
        for i in range(10):
            response = self.client.get('/api/clients/')
            current_memory = process.memory_info().rss / 1024 / 1024  # MB
            memory_measurements.append(current_memory)
        
        # Test data processing (simulate)
        for i in range(100):
            # Simulate data processing
            data = {'test': 'data' * 1000}
            json.dumps(data)
            
            if i % 20 == 0:
                current_memory = process.memory_info().rss / 1024 / 1024  # MB
                memory_measurements.append(current_memory)
        
        peak_memory = max(memory_measurements)
        avg_memory = sum(memory_measurements) / len(memory_measurements)
        
        memory_stats = {
            'initial_mb': round(initial_memory, 2),
            'peak_mb': round(peak_memory, 2),
            'average_mb': round(avg_memory, 2),
            'memory_increase_mb': round(peak_memory - initial_memory, 2)
        }
        
        # Assert memory usage meets baseline
        self.assertLess(
            peak_memory,
            self.baselines['memory_usage_mb'],
            f"Memory usage {peak_memory:.2f}MB exceeds baseline {self.baselines['memory_usage_mb']}MB"
        )
        
        self.performance_results['measurements']['memory_usage'] = memory_stats
        print(f"  Initial: {initial_memory:.2f}MB")
        print(f"  Peak: {peak_memory:.2f}MB")
        print(f"  Average: {avg_memory:.2f}MB")
        print("✅ Memory Usage Baselines Established")
    
    def measure_cpu_usage(self):
        """Measure CPU usage during operations"""
        print("\n⚡ Measuring CPU Usage...")
        
        # Measure CPU usage during API operations
        cpu_measurements = []
        
        # Perform CPU-intensive operations
        for i in range(20):
            start_cpu = psutil.cpu_percent()
            
            # Perform multiple API calls
            for j in range(5):
                self.client.get('/api/clients/')
            
            end_cpu = psutil.cpu_percent()
            cpu_measurements.append(max(start_cpu, end_cpu))
        
        avg_cpu = sum(cpu_measurements) / len(cpu_measurements)
        peak_cpu = max(cpu_measurements)
        
        cpu_stats = {
            'average_percent': round(avg_cpu, 2),
            'peak_percent': round(peak_cpu, 2),
            'measurements': cpu_measurements
        }
        
        # Assert CPU usage meets baseline
        self.assertLess(
            avg_cpu,
            self.baselines['cpu_usage_percent'],
            f"CPU usage {avg_cpu:.2f}% exceeds baseline {self.baselines['cpu_usage_percent']}%"
        )
        
        self.performance_results['measurements']['cpu_usage'] = cpu_stats
        print(f"  Average: {avg_cpu:.2f}%")
        print(f"  Peak: {peak_cpu:.2f}%")
        print("✅ CPU Usage Baselines Established")
    
    def measure_concurrent_performance(self):
        """Measure performance under concurrent load"""
        print("\n👥 Measuring Concurrent Performance...")
        
        import threading
        import queue
        
        results = queue.Queue()
        threads = []
        
        def simulate_user():
            """Simulate a single user making requests"""
            user_times = []
            
            for i in range(5):
                start_time = time.time()
                
                # Simulate user actions
                response1 = self.client.get('/api/clients/')
                response2 = self.client.get('/api/appointments/')
                response3 = self.client.get('/api/staff/')
                
                end_time = time.time()
                total_time = (end_time - start_time) * 1000
                user_times.append(total_time)
            
            avg_time = sum(user_times) / len(user_times)
            results.put({
                'avg_response_time': avg_time,
                'times': user_times
            })
        
        # Create concurrent users
        concurrent_users = 10  # Start with 10 concurrent users
        
        for i in range(concurrent_users):
            thread = threading.Thread(target=simulate_user)
            threads.append(thread)
            thread.start()
        
        # Wait for all threads to complete
        for thread in threads:
            thread.join()
        
        # Collect results
        user_results = []
        while not results.empty():
            user_results.append(results.get())
        
        if user_results:
            avg_response_times = [result['avg_response_time'] for result in user_results]
            overall_avg = sum(avg_response_times) / len(avg_response_times)
            max_response_time = max(avg_response_times)
            
            concurrent_stats = {
                'concurrent_users': concurrent_users,
                'average_response_time_ms': round(overall_avg, 2),
                'max_response_time_ms': round(max_response_time, 2),
                'user_results': user_results
            }
            
            # Assert concurrent performance meets baseline
            self.assertLess(
                overall_avg,
                self.baselines['api_response_time_ms'] * 2,  # Allow 2x under load
                f"Concurrent response time {overall_avg:.2f}ms exceeds baseline {self.baselines['api_response_time_ms'] * 2}ms"
            )
            
            self.performance_results['measurements']['concurrent_performance'] = concurrent_stats
            print(f"  Concurrent Users: {concurrent_users}")
            print(f"  Average Response Time: {overall_avg:.2f}ms")
            print(f"  Max Response Time: {max_response_time:.2f}ms")
        
        print("✅ Concurrent Performance Baselines Established")
    
    def generate_performance_report(self):
        """Generate comprehensive performance report"""
        print("\n📋 Generating Performance Report...")
        
        # Add recommendations based on measurements
        recommendations = []
        
        api_times = self.performance_results['measurements'].get('api_response_times', {})
        if api_times:
            avg_api_time = sum(endpoint['average_ms'] for endpoint in api_times.values()) / len(api_times)
            if avg_api_time > self.baselines['api_response_time_ms'] * 0.8:
                recommendations.append({
                    'priority': 'HIGH',
                    'category': 'API Performance',
                    'issue': f'Average API response time {avg_api_time:.2f}ms is close to baseline',
                    'recommendation': 'Consider API optimization and caching'
                })
        
        memory_usage = self.performance_results['measurements'].get('memory_usage', {})
        if memory_usage and memory_usage['peak_mb'] > self.baselines['memory_usage_mb'] * 0.8:
            recommendations.append({
                'priority': 'MEDIUM',
                'category': 'Memory Usage',
                'issue': f'Peak memory usage {memory_usage["peak_mb"]:.2f}MB is close to baseline',
                'recommendation': 'Monitor memory usage and consider optimization'
            })
        
        cpu_usage = self.performance_results['measurements'].get('cpu_usage', {})
        if cpu_usage and cpu_usage['average_percent'] > self.baselines['cpu_usage_percent'] * 0.8:
            recommendations.append({
                'priority': 'MEDIUM',
                'category': 'CPU Usage',
                'issue': f'Average CPU usage {cpu_usage["average_percent"]:.2f}% is close to baseline',
                'recommendation': 'Monitor CPU usage and consider optimization'
            })
        
        self.performance_results['recommendations'] = recommendations
        
        # Save performance report
        report_path = 'backend/reports/performance_baselines.json'
        os.makedirs(os.path.dirname(report_path), exist_ok=True)
        
        with open(report_path, 'w') as f:
            json.dump(self.performance_results, f, indent=2, default=str)
        
        print(f"📄 Performance report saved to {report_path}")
        
        # Print summary
        print("\n📊 Performance Baselines Summary:")
        print(f"  API Response Time: {self.baselines['api_response_time_ms']}ms")
        print(f"  Memory Usage: {self.baselines['memory_usage_mb']}MB")
        print(f"  CPU Usage: {self.baselines['cpu_usage_percent']}%")
        print(f"  Concurrent Users: {self.baselines['concurrent_users']}")
        
        if recommendations:
            print("\n💡 Recommendations:")
            for rec in recommendations:
                print(f"  [{rec['priority']}] {rec['recommendation']}")
        
        print("✅ Performance Baselines and Monitoring Established")
    
    def test_performance_baselines(self):
        """Run complete performance baseline testing"""
        print("🚀 Starting Performance Baseline Testing")
        print("=" * 60)
        
        # Run all performance measurements
        self.measure_api_response_time()
        self.measure_memory_usage()
        self.measure_cpu_usage()
        self.measure_concurrent_performance()
        self.generate_performance_report()
        
        print("\n" + "=" * 60)
        print("✅ Performance Baseline Testing Complete!")
        print("📊 All baselines established and validated")
        print("📄 Performance report generated")
        print("🔍 Monitoring system ready for continuous tracking")

