import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const JournalOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    todayEntry: null,
    currentStreak: 0,
    totalEntries: 0,
    recentEntries: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleAddEntry = () => {
    navigate('/journal/add');
  };

  // In a real app, this would fetch data from the backend API
  useEffect(() => {
    setLoading(true);
    fetch('/api/entries')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(res.statusText))))
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        const today = new Date().toISOString().slice(0, 10);
        setStats({
          todayEntry: list.find((e) => e.date === today) || null,
          currentStreak: list.length,
          totalEntries: list.length,
          recentEntries: list.slice(0, 5).map((e) => ({
            id: e.id,
            date: e.date,
            projectName: e.projectName,
            language: e.language,
            timeSpentMin: e.timeSpentMin,
            mood: e.mood,
            preview: e.task || e.whatILearned || 'Entry',
          })),
        });
        setLoading(false);
      })
      .catch(() => {
        // Backend not running — fall back to mock data
        setStats({
          todayEntry: null,
          currentStreak: 5,
          totalEntries: 23,
          recentEntries: [
          {
            id: 1,
            date: '2026-09-30',
            projectName: 'DevLog',
            language: 'Java',
            timeSpentMin: 90,
            mood: 'FOCUSED',
            preview: 'Set up DevLog project structure...'
          },
          {
            id: 2,
            date: '2026-09-29',
            projectName: 'java-practice',
            language: 'Java',
            timeSpentMin: 60,
            mood: 'PRODUCTIVE',
            preview: 'Practiced Java Streams API...'
          }
        ]
      });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full border-4 border-b-journal h-12 w-12 mx-auto mb-4"></div>
        <p className="text-text-secondary">Loading your journal...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-primary">Journal Overview</h1>
        <button
          onClick={handleAddEntry}
          className="bg-journal hover:bg-journal/90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Add Entry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-bg-secondary/50 rounded-lg p-4 border border-border">
          <h2 className="text-lg font-semibold text-journal mb-2">Today's Entry</h2>
          {stats.todayEntry ? (
            <>
              <p className="text-text-secondary">{stats.todayEntry.projectName}</p>
              <p className="text-text-secondary">{stats.todayEntry.timeSpentMin} min • {stats.todayEntry.language}</p>
            </>
          ) : (
            <p className="text-text-secondary">No entry yet for today</p>
          )}
          <button
            onClick={handleAddEntry}
            className="mt-2 bg-journal/20 hover:bg-journal/30 text-journal py-1 px-3 rounded border border-journal/30 text-sm"
          >
            Write now
          </button>
        </div>

        <div className="bg-bg-secondary/50 rounded-lg p-4 border border-border">
          <h2 className="text-lg font-semibold text-insights mb-2">Current Streak</h2>
          <p className="text-4xl font-bold text-text-primary">{stats.currentStreak}</p>
          <p className="text-text-secondary">days</p>
        </div>

        <div className="bg-bg-secondary/50 rounded-lg p-4 border border-border">
          <h2 className="text-lg font-semibold text-repo mb-2">Total Entries</h2>
          <p className="text-4xl font-bold text-text-primary">{stats.totalEntries}</p>
          <p className="text-text-secondary">entries logged</p>
        </div>
      </div>

      <div className="bg-bg-secondary/50 rounded-lg p-4 border border-border">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Recent Entries</h2>
        {stats.recentEntries.length === 0 ? (
          <p className="text-text-secondary text-center py-6">No entries yet. Start your first journal entry!</p>
        ) : (
          <div className="space-y-3">
            {stats.recentEntries.map(entry => (
              <div
                key={entry.id}
                className="p-3 bg-bg-secondary rounded hover:bg-bg-secondary/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/journal/history/${entry.id}`)}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium">{new Date(entry.date).toLocaleDateString()}</span>
                  <span className="text-xs bg-journal/20 text-journal px-2 py-0.5 rounded">{entry.language}</span>
                </div>
                <p className="text-text-secondary line-clamp-2">{entry.preview}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalOverview;