"""
Project Sentinel AI Analysis Service
Analyzes training session data and provides performance feedback
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)

class PerformanceAnalyzer:
    """
    Analyzes sensor data to evaluate training performance
    """
    
    def __init__(self):
        # Performance thresholds and weights
        self.thresholds = {
            'movement_smoothness': 0.7,
            'reaction_time': 2.0,  # seconds
            'hand_stability': 0.8,
            'task_completion': 0.9
        }
        
        self.weights = {
            'movement_smoothness': 0.25,
            'reaction_time': 0.25,
            'hand_stability': 0.25,
            'task_completion': 0.25
        }
    
    def analyze_movement_smoothness(self, sensor_data):
        """
        Analyze movement smoothness based on IMU data
        Returns score between 0-1 (higher is better)
        """
        if not sensor_data:
            return 0.0
        
        # Extract acceleration data
        accel_data = []
        for reading in sensor_data:
            if 'imu' in reading and 'acceleration' in reading['imu']:
                acc = reading['imu']['acceleration']
                magnitude = np.sqrt(acc['x']**2 + acc['y']**2 + acc['z']**2)
                accel_data.append(magnitude)
        
        if len(accel_data) < 2:
            return 0.0
        
        # Calculate smoothness as inverse of acceleration variance
        variance = np.var(accel_data)
        smoothness = 1.0 / (1.0 + variance)
        return min(smoothness, 1.0)
    
    def analyze_reaction_time(self, sensor_data):
        """
        Analyze reaction time based on flex sensor response
        Returns score between 0-1 (higher is better)
        """
        if not sensor_data:
            return 0.0
        
        # Simplified reaction time analysis
        # Look for significant changes in flex sensor values
        flex_changes = []
        prev_values = None
        
        for reading in sensor_data:
            if 'flexSensors' in reading:
                current_values = [sensor['value'] for sensor in reading['flexSensors']]
                if prev_values:
                    change = sum(abs(c - p) for c, p in zip(current_values, prev_values))
                    flex_changes.append(change)
                prev_values = current_values
        
        if not flex_changes:
            return 0.0
        
        # Calculate average reaction time (lower is better)
        avg_change = np.mean(flex_changes)
        reaction_score = min(1.0, 1.0 / (1.0 + avg_change))
        return reaction_score
    
    def analyze_hand_stability(self, sensor_data):
        """
        Analyze hand stability based on gyroscope data
        Returns score between 0-1 (higher is better)
        """
        if not sensor_data:
            return 0.0
        
        # Extract gyroscope data
        gyro_data = []
        for reading in sensor_data:
            if 'imu' in reading and 'gyroscope' in reading['imu']:
                gyro = reading['imu']['gyroscope']
                magnitude = np.sqrt(gyro['x']**2 + gyro['y']**2 + gyro['z']**2)
                gyro_data.append(magnitude)
        
        if len(gyro_data) < 2:
            return 0.0
        
        # Calculate stability as inverse of gyroscope variance
        variance = np.var(gyro_data)
        stability = 1.0 / (1.0 + variance * 10)  # Scale factor for sensitivity
        return min(stability, 1.0)
    
    def analyze_task_completion(self, sensor_data, session_duration):
        """
        Analyze task completion based on session duration and activity
        Returns score between 0-1 (higher is better)
        """
        if not sensor_data or session_duration <= 0:
            return 0.0
        
        # Calculate activity level
        total_activity = 0
        for reading in sensor_data:
            if 'flexSensors' in reading:
                activity = sum(sensor['value'] for sensor in reading['flexSensors'])
                total_activity += activity
        
        # Normalize by session duration and number of readings
        avg_activity = total_activity / (len(sensor_data) * 5)  # 5 flex sensors
        completion_score = min(avg_activity * 2, 1.0)  # Scale appropriately
        return completion_score
    
    def generate_feedback(self, scores):
        """
        Generate actionable feedback based on performance scores
        """
        feedback = []
        
        if scores['movement_smoothness'] < self.thresholds['movement_smoothness']:
            feedback.append("Focus on smoother, more controlled movements. Practice slow, deliberate motions.")
        
        if scores['reaction_time'] < self.thresholds['reaction_time']:
            feedback.append("Work on faster response times. Practice quick decision-making scenarios.")
        
        if scores['hand_stability'] < self.thresholds['hand_stability']:
            feedback.append("Improve hand stability through targeted exercises and proper positioning.")
        
        if scores['task_completion'] < self.thresholds['task_completion']:
            feedback.append("Increase engagement with training scenarios. Complete all required actions.")
        
        if not feedback:
            feedback.append("Excellent performance! Continue practicing to maintain your skills.")
        
        return feedback

analyzer = PerformanceAnalyzer()

@app.route('/analyze', methods=['POST'])
def analyze_session():
    """
    Analyze training session data and return performance report
    
    Expected input:
    {
        "sessionId": "string",
        "sensorData": [...],
        "duration": number,
        "scenario": "string"
    }
    
    Returns:
    {
        "performanceScore": number,
        "detailedScores": {...},
        "feedback": [...],
        "recommendations": [...],
        "timestamp": "string"
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'sensorData' not in data:
            return jsonify({'error': 'Invalid input data'}), 400
        
        sensor_data = data['sensorData']
        duration = data.get('duration', 0)
        scenario = data.get('scenario', 'unknown')
        
        # Perform individual analyses
        movement_score = analyzer.analyze_movement_smoothness(sensor_data)
        reaction_score = analyzer.analyze_reaction_time(sensor_data)
        stability_score = analyzer.analyze_hand_stability(sensor_data)
        completion_score = analyzer.analyze_task_completion(sensor_data, duration)
        
        # Calculate weighted overall score
        detailed_scores = {
            'movement_smoothness': round(movement_score * 100, 2),
            'reaction_time': round(reaction_score * 100, 2),
            'hand_stability': round(stability_score * 100, 2),
            'task_completion': round(completion_score * 100, 2)
        }
        
        overall_score = (
            movement_score * analyzer.weights['movement_smoothness'] +
            reaction_score * analyzer.weights['reaction_time'] +
            stability_score * analyzer.weights['hand_stability'] +
            completion_score * analyzer.weights['task_completion']
        ) * 100
        
        # Generate feedback
        score_dict = {
            'movement_smoothness': movement_score,
            'reaction_time': reaction_score,
            'hand_stability': stability_score,
            'task_completion': completion_score
        }
        
        feedback = analyzer.generate_feedback(score_dict)
        
        # Generate recommendations based on scenario
        recommendations = generate_scenario_recommendations(scenario, detailed_scores)
        
        response = {
            'performanceScore': round(overall_score, 2),
            'detailedScores': detailed_scores,
            'feedback': feedback,
            'recommendations': recommendations,
            'timestamp': datetime.now().isoformat(),
            'dataPoints': len(sensor_data),
            'sessionDuration': duration
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def generate_scenario_recommendations(scenario, scores):
    """
    Generate scenario-specific recommendations
    """
    recommendations = []
    
    if scenario.lower() == 'chemical_spill':
        if scores['reaction_time'] < 70:
            recommendations.append("Practice rapid containment procedures for chemical spills")
        if scores['hand_stability'] < 70:
            recommendations.append("Focus on steady handling of containment equipment")
    
    elif scenario.lower() == 'gas_leak':
        if scores['movement_smoothness'] < 70:
            recommendations.append("Practice smooth evacuation movements in gas leak scenarios")
        if scores['task_completion'] < 70:
            recommendations.append("Review gas leak response protocols thoroughly")
    
    else:
        recommendations.append("Continue practicing various emergency response scenarios")
        recommendations.append("Focus on areas with lower performance scores")
    
    return recommendations

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Project Sentinel AI Service',
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    print("Project Sentinel AI Service starting...")
    app.run(host='0.0.0.0', port=5000, debug=True)