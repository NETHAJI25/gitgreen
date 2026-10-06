import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const JavaTopics = [
  { id: 1, name: 'Core Java Basics', description: 'Variables, data types, operators, control flow' },
  { id: 2, name: 'Object-Oriented Programming', description: 'Classes, objects, inheritance, polymorphism' },
  { id: 3, name: 'Collections Framework', description: 'Lists, sets, maps, iterators' },
  { id: 4, name: 'Streams & Lambda', description: 'Functional programming, stream operations' },
  { id: 5, name: 'Exception Handling', description: 'Try-catch, custom exceptions, best practices' },
  { id: 6, name: 'Concurrency', description: 'Threads, synchronization, concurrent collections' },
  { id: 7, name: 'Spring Boot Fundamentals', description: 'Dependency injection, REST controllers' },
  { id: 8, name: 'JPA/Hibernate', description: 'ORM, entity relationships, repositories' },
  { id: 9, name: 'Testing (JUnit 5)', description: 'Unit testing, mocking, test-driven development' },
  { id: 10, name: 'Capstone Project', description: 'Build a full-stack application' }
];

const JavaLearningTrack = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [exerciseCode, setExerciseCode] = useState('');
  const navigate = useNavigate();

  const JavaExercises = {
    1: 'Write a program that calculates the area of a circle given its radius.',
    2: 'Create a class hierarchy for different types of vehicles (Car, Truck, Motorcycle).',
    3: 'Implement a program that manages a list of students with add/remove/search operations.',
    4: 'Use streams to process a list of numbers and find the average of even numbers.',
    5: 'Create a custom exception for invalid age input and use it in a validation method.',
    6: 'Write a producer-consumer problem using wait() and notify() methods.',
    7: 'Create a simple REST API with Spring Boot that returns a greeting message.',
    8: 'Design JPA entities for a blog system with Posts, Comments, and Categories.',
    9: 'Write unit tests for a calculator class using JUnit 5 and Mockito.',
    10: 'Build a task management application with Java backend and React frontend.'
  };

  const handleStartExercise = (topicId) => {
    setSelectedTopic(topicId);
    setExerciseCode('');
  };

  const handleSaveExercise = async () => {
    // In a real app, this would:
    // 1. Save the exercise code to the journal
    // 2. Optionally save as a .java file in the java-practice directory
    // 3. Commit and push to GitHub
    // 4. Mark topic as completed

    alert('Exercise saved! (In a real app, this would commit to GitHub and update progress)');
    setSelectedTopic(null);
  };

  if (!selectedTopic) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-text-primary">Java Learning Track</h1>
        <p className="text-text-secondary">Structured path to master Java development</p>

        <div className="grid gap-4">
          {JavaTopics.map(topic => (
            <div
              key={topic.id}
              className="bg-bg-secondary/50 rounded-lg p-4 border border-border hover:bg-bg-secondary/70 transition-colors cursor-pointer"
              onClick={() => handleStartExercise(topic.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-text-primary">{topic.name}</h3>
                <span className="text-xs bg-insights/20 text-insights px-2 py-0.5 rounded">Topic {topic.id}</span>
              </div>
              <p className="text-text-secondary text-sm">{topic.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const topic = JavaTopics.find(t => t.id === selectedTopic);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start mb-4">
        <button
          onClick={() => setSelectedTopic(null)}
          className="text-text-secondary hover:text-text-primary"
        >
          ← Back to Topics
        </button>
        <h2 className="text-xl font-bold text-text-primary">{topic.name}</h2>
      </div>

      <p className="text-text-secondary">{topic.description}</p>

      <div className="bg-bg-secondary/50 rounded-lg p-4 border border-border">
        <h3 className="font-semibold mb-2">Today's Exercise</h3>
        <p className="text-text-secondary italic mb-3">{JavaExercises[selectedTopic]}</p>

        <div className="space-y-3">
          <label className="block text-sm font-medium mb-1">Your Solution</label>
          <textarea
            value={exerciseCode}
            onChange={(e) => setExerciseCode(e.target.value)}
            className="w-full px-3 py-2 bg-bg-secondary/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-journal font-mono"
            rows="15"
            placeholder="Write your Java solution here..."
          />
        </div>

        <div className="mt-4">
          <button
            onClick={handleSaveExercise}
            className="bg-journal hover:bg-journal/90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Save Exercise
          </button>
        </div>
      </div>
    </div>
  );
};

export default JavaLearningTrack;