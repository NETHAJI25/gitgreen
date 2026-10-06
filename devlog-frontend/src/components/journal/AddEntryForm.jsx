import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { marked } from 'marked';

const AddEntryForm = () => {
  const [formData, setFormData] = useState({
    project: '',
    task: '',
    input: '',
    output: '',
    sample: '',
    whatILearned: '',
    nextSteps: '',
    tags: '',
    language: '',
    timeSpent: '',
    mood: 'FOCUSED'
  });
  const [preview, setPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update preview when content changes
    if (name === 'task' || name === 'input' || name === 'output' ||
        name === 'sample' || name === 'whatILearned' || name === 'nextSteps') {
      generatePreview();
    }
  };

  const generatePreview = () => {
    const { task, input, output, sample, whatILearned, nextSteps } = formData;
    let markdown = '';

    if (task) markdown += `# What I worked on\n${task}\n\n`;
    if (input) markdown += `# Input\n${input}\n\n`;
    if (output) markdown += `# Output\n${output}\n\n`;
    if (sample) markdown += `# Sample\n${sample}\n\n`;
    if (whatILearned) markdown += `# What I learned\n${whatILearned}\n\n`;
    if (nextSteps) markdown += `# Next steps\n${nextSteps}\n\n`;

    setPreview(markdown || '# Start writing to see preview...');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        date: new Date().toISOString().slice(0, 10),
        projectName: formData.project,
        language: formData.language || null,
        timeSpentMin: formData.timeSpent ? parseInt(formData.timeSpent, 10) : 0,
        backfilled: false,
        mood: formData.mood,
        task: formData.task,
        input: formData.input,
        output: formData.output,
        sample: formData.sample,
        whatILearned: formData.whatILearned,
        nextSteps: formData.nextSteps,
        tags: formData.tags
          ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
      };

      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Save failed: ${res.status}`);
      navigate('/journal/overview');
    } catch (error) {
      alert('Failed to save entry. Is the backend running on :8080? ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Add Journal Entry</h1>
        <p className="text-text-secondary">Document your work in under 2 minutes</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Project</label>
            <input
              type="text"
              name="project"
              value={formData.project}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-bg-secondary/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-journal"
              placeholder="e.g., DevLog, java-practice, website-redesign"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Language</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-bg-secondary/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-journal"
            >
              <option value="">Select language (optional)</option>
              <option value="Java">Java</option>
              <option value="JavaScript">JavaScript</option>
              <option value="TypeScript">TypeScript</option>
              <option value="Python">Python</option>
              <option value="HTML/CSS">HTML/CSS</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium mb-1">Task / What I worked on</label>
          <textarea
            name="task"
            value={formData.task}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-bg-secondary/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-journal"
            rows="3"
            placeholder="Brief description of what you worked on..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="block text-sm font-medium mb-1">Input</label>
            <textarea
              name="input"
              value={formData.input}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-bg-secondary/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-journal"
              rows="3"
              placeholder="What you started with, requirements, problem statement..."
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium mb-1">Output</label>
            <textarea
              name="output"
              value={formData.output}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-bg-secondary/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-journal"
              rows="3"
              placeholder="What you produced, solution, results..."
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium mb-1">Sample (code, command, or link)</label>
          <textarea
            name="sample"
            value={formData.sample}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-bg-secondary/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-journal"
            rows="3"
            placeholder="Code snippet, terminal command, or relevant link..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="block text-sm font-medium mb-1">What I learned</label>
            <textarea
              name="whatILearned"
              value={formData.whatILearned}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-bg-secondary/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-journal"
              rows="3"
              placeholder="Insights, discoveries, lessons learned..."
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium mb-1">Next steps</label>
            <textarea
              name="nextSteps"
              value={formData.nextSteps}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-bg-secondary/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-journal"
              rows="3"
              placeholder="What to work on tomorrow, open questions..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-bg-secondary/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-journal"
              placeholder="e.g., java, collections, streams, bugfix"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium mb-1">Time spent (minutes)</label>
            <input
              type="number"
              name="timeSpent"
              value={formData.timeSpent}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-bg-secondary/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-journal"
              min="1"
              placeholder="e.g., 60"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium mb-1">Mood</label>
            <select
              name="mood"
              value={formData.mood}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-bg-secondary/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-journal"
            >
              <option value="PRODUCTIVE">Productive</option>
              <option value="FRUSTRATED">Frustrated</option>
              <option value="TIRED">Tired</option>
              <option value="ENERGIZED">Energized</option>
              <option value="FOCUSED">Focused</option>
              <option value="DISTRACTED">Distracted</option>
            </select>
          </div>
        </div>

        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Preview</h2>
          <div className="bg-bg-secondary/50 rounded-lg p-4 min-h-[200px] border border-border">
            <div
              className="prose prose-sm text-text-secondary"
              dangerouslySetInnerHTML={{ __html: marked.parse(preview) }}
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-journal hover:bg-journal/90 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Save Entry'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEntryForm;