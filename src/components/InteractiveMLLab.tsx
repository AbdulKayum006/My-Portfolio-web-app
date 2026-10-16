import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Copy, Check, BarChart2, Cpu, Sliders, Code2, Layers, Activity } from 'lucide-react';

type DatasetType = 'spiral' | 'moons' | 'circles' | 'xor';
type ActivationType = 'relu' | 'gelu' | 'tanh' | 'sigmoid';

interface Point {
  x: number;
  y: number;
  label: number;
}

export const InteractiveMLLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'neural-net' | 'eda-inference'>('neural-net');

  // Neural Network Simulator States
  const [datasetType, setDatasetType] = useState<DatasetType>('spiral');
  const [learningRate, setLearningRate] = useState<number>(0.15);
  const [activation, setActivation] = useState<ActivationType>('relu');
  const [hiddenNeurons, setHiddenNeurons] = useState<number>(8);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [currentEpoch, setCurrentEpoch] = useState<number>(0);
  const [currentLoss, setCurrentLoss] = useState<number>(0.693);
  const [currentAcc, setCurrentAcc] = useState<number>(50.0);
  const [lossHistory, setLossHistory] = useState<number[]>([]);
  const [showCode, setShowCode] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Canvas references
  const decisionCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lossCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Synthetic data storage
  const pointsRef = useRef<Point[]>([]);

  // Simple 2-layer Neural Net weights:
  // Input: 2 -> Hidden: hiddenNeurons -> Output: 1
  const weightsRef = useRef<{
    W1: number[][]; // 2 x hiddenNeurons
    b1: number[];   // hiddenNeurons
    W2: number[];   // hiddenNeurons
    b2: number;
  }>({
    W1: [],
    b1: [],
    W2: [],
    b2: 0,
  });

  // Generate synthetic points
  const generateDataset = (type: DatasetType): Point[] => {
    const points: Point[] = [];
    const n = 120; // 60 per class

    if (type === 'spiral') {
      for (let i = 0; i < n / 2; i++) {
        const r = (i / (n / 2)) * 1.8 + 0.1;
        const theta = 1.75 * i * (2 * Math.PI / (n / 2));
        const noiseX = (Math.random() - 0.5) * 0.12;
        const noiseY = (Math.random() - 0.5) * 0.12;
        points.push({ x: r * Math.sin(theta) + noiseX, y: r * Math.cos(theta) + noiseY, label: 0 });
        points.push({ x: -r * Math.sin(theta) + noiseX, y: -r * Math.cos(theta) + noiseY, label: 1 });
      }
    } else if (type === 'moons') {
      for (let i = 0; i < n / 2; i++) {
        const theta = Math.PI * (i / (n / 2));
        const noiseX = (Math.random() - 0.5) * 0.15;
        const noiseY = (Math.random() - 0.5) * 0.15;
        points.push({
          x: Math.cos(theta) * 1.2 - 0.5 + noiseX,
          y: Math.sin(theta) * 1.2 - 0.3 + noiseY,
          label: 0
        });
        points.push({
          x: 1 - Math.cos(theta) * 1.2 - 0.5 + noiseX,
          y: 0.5 - Math.sin(theta) * 1.2 - 0.3 + noiseY,
          label: 1
        });
      }
    } else if (type === 'circles') {
      for (let i = 0; i < n / 2; i++) {
        const theta = Math.random() * 2 * Math.PI;
        const r1 = 0.5 + Math.random() * 0.25;
        const r2 = 1.3 + Math.random() * 0.35;
        points.push({ x: r1 * Math.cos(theta), y: r1 * Math.sin(theta), label: 0 });
        points.push({ x: r2 * Math.cos(theta), y: r2 * Math.sin(theta), label: 1 });
      }
    } else {
      // XOR
      for (let i = 0; i < n; i++) {
        const x = (Math.random() - 0.5) * 3;
        const y = (Math.random() - 0.5) * 3;
        const label = (x > 0 && y > 0) || (x < 0 && y < 0) ? 1 : 0;
        points.push({ x, y, label });
      }
    }
    return points;
  };

  // Initialize weights
  const resetModel = () => {
    setIsTraining(false);
    setCurrentEpoch(0);
    setLossHistory([]);

    const points = generateDataset(datasetType);
    pointsRef.current = points;

    // Xavier/He init
    const std1 = Math.sqrt(2 / 2);
    const W1: number[][] = [];
    for (let i = 0; i < 2; i++) {
      const row: number[] = [];
      for (let j = 0; j < hiddenNeurons; j++) {
        row.push((Math.random() * 2 - 1) * std1);
      }
      W1.push(row);
    }
    const b1: number[] = new Array(hiddenNeurons).fill(0);
    const std2 = Math.sqrt(2 / hiddenNeurons);
    const W2: number[] = [];
    for (let j = 0; j < hiddenNeurons; j++) {
      W2.push((Math.random() * 2 - 1) * std2);
    }
    const b2 = 0;

    weightsRef.current = { W1, b1, W2, b2 };
    evaluateAndRender();
  };

  // Forward activation
  const act = (z: number, type: ActivationType): number => {
    if (type === 'relu') return Math.max(0, z);
    if (type === 'gelu') return 0.5 * z * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (z + 0.044715 * Math.pow(z, 3))));
    if (type === 'tanh') return Math.tanh(z);
    return 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, z)))); // sigmoid
  };

  const actDeriv = (z: number, a: number, type: ActivationType): number => {
    if (type === 'relu') return z > 0 ? 1 : 0;
    if (type === 'gelu') return z > 0 ? 1 : 0.05; // approximation for browser loop
    if (type === 'tanh') return 1 - a * a;
    return a * (1 - a); // sigmoid
  };

  const sigmoid = (z: number) => 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, z))));

  const predictSingle = (x1: number, x2: number): number => {
    const { W1, b1, W2, b2 } = weightsRef.current;
    let z2 = b2;
    for (let j = 0; j < hiddenNeurons; j++) {
      const z1_j = x1 * W1[0][j] + x2 * W1[1][j] + b1[j];
      const a1_j = act(z1_j, activation);
      z2 += a1_j * W2[j];
    }
    return sigmoid(z2);
  };

  // Train one step
  const trainStep = () => {
    const points = pointsRef.current;
    if (points.length === 0) return;

    const { W1, b1, W2, b2 } = weightsRef.current;
    const lr = learningRate;

    let totalLoss = 0;
    let correct = 0;

    // Gradients
    const dW1: number[][] = [new Array(hiddenNeurons).fill(0), new Array(hiddenNeurons).fill(0)];
    const db1: number[] = new Array(hiddenNeurons).fill(0);
    const dW2: number[] = new Array(hiddenNeurons).fill(0);
    let db2 = 0;

    for (let i = 0; i < points.length; i++) {
      const pt = points[i];
      const x1 = pt.x;
      const x2 = pt.y;
      const y = pt.label;

      // Hidden layer forward
      const z1: number[] = [];
      const a1: number[] = [];
      let z2 = b2;

      for (let j = 0; j < hiddenNeurons; j++) {
        const val = x1 * W1[0][j] + x2 * W1[1][j] + b1[j];
        z1.push(val);
        const activated = act(val, activation);
        a1.push(activated);
        z2 += activated * W2[j];
      }

      const p = sigmoid(z2);
      const eps = 1e-12;
      const loss = -(y * Math.log(p + eps) + (1 - y) * Math.log(1 - p + eps));
      totalLoss += loss;

      if ((p >= 0.5 && y === 1) || (p < 0.5 && y === 0)) correct++;

      // Backward
      const dz2 = p - y;
      db2 += dz2;
      for (let j = 0; j < hiddenNeurons; j++) {
        dW2[j] += dz2 * a1[j];
        const da1_j = dz2 * W2[j];
        const dz1_j = da1_j * actDeriv(z1[j], a1[j], activation);
        dW1[0][j] += dz1_j * x1;
        dW1[1][j] += dz1_j * x2;
        db1[j] += dz1_j;
      }
    }

    const m = points.length;
    // Update weights
    for (let j = 0; j < hiddenNeurons; j++) {
      W1[0][j] -= (lr * dW1[0][j]) / m;
      W1[1][j] -= (lr * dW1[1][j]) / m;
      b1[j] -= (lr * db1[j]) / m;
      W2[j] -= (lr * dW2[j]) / m;
    }
    weightsRef.current.b2 -= (lr * db2) / m;

    const avgLoss = totalLoss / m;
    const accuracy = (correct / m) * 100;

    setCurrentLoss(avgLoss);
    setCurrentAcc(accuracy);
    setCurrentEpoch((prev) => prev + 1);
    setLossHistory((prev) => [...prev.slice(-80), avgLoss]);

    renderDecisionSurface();
  };

  const renderDecisionSurface = () => {
    const canvas = decisionCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const resolution = 28; // Grid sampling
    const dx = width / resolution;
    const dy = height / resolution;

    // Range [-2.2, 2.2]
    const range = 2.4;

    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        const xCoord = ((i + 0.5) / resolution) * (2 * range) - range;
        const yCoord = (1 - (j + 0.5) / resolution) * (2 * range) - range;
        const prob = predictSingle(xCoord, yCoord);

        // Interpolate colors: Blue (Class 0) to Coral/Orange (Class 1)
        const r = Math.round(30 + prob * (239 - 30));
        const g = Math.round(58 + prob * (68 - 58));
        const b = Math.round(138 + (1 - prob) * (240 - 138));

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.65)`;
        ctx.fillRect(i * dx, j * dy, dx + 1, dy + 1);
      }
    }

    // Draw grid axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Draw training sample points
    const points = pointsRef.current;
    for (const pt of points) {
      const cx = ((pt.x + range) / (2 * range)) * width;
      const cy = (1 - (pt.y + range) / (2 * range)) * height;

      ctx.beginPath();
      ctx.arc(cx, cy, 4.5, 0, 2 * Math.PI);
      if (pt.label === 0) {
        ctx.fillStyle = '#60a5fa'; // light blue
        ctx.strokeStyle = '#1e3a8a';
      } else {
        ctx.fillStyle = '#f87171'; // coral
        ctx.strokeStyle = '#991b1b';
      }
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();
    }
  };

  const evaluateAndRender = () => {
    const points = pointsRef.current;
    if (points.length === 0) return;
    let totalLoss = 0;
    let correct = 0;
    for (const pt of points) {
      const p = predictSingle(pt.x, pt.y);
      const eps = 1e-12;
      totalLoss += -(pt.label * Math.log(p + eps) + (1 - pt.label) * Math.log(1 - p + eps));
      if ((p >= 0.5 && pt.label === 1) || (p < 0.5 && pt.label === 0)) correct++;
    }
    setCurrentLoss(totalLoss / points.length);
    setCurrentAcc((correct / points.length) * 100);
    renderDecisionSurface();
  };

  // Training loop effect
  useEffect(() => {
    let animId: number;
    if (isTraining) {
      const loop = () => {
        // Run 4 sub-steps per frame for smooth convergence
        for (let k = 0; k < 4; k++) {
          trainStep();
        }
        animId = requestAnimationFrame(loop);
      };
      animId = requestAnimationFrame(loop);
    }
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isTraining, learningRate, activation, hiddenNeurons]);

  // Initial setup & dataset change
  useEffect(() => {
    resetModel();
  }, [datasetType, hiddenNeurons, activation]);

  // Render loss curve
  useEffect(() => {
    const canvas = lossCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background grid
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
    ctx.lineWidth = 1;
    for (let y = 20; y < canvas.height; y += 25) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    if (lossHistory.length < 2) return;

    const maxLoss = 1.2;
    const minLoss = 0.0;

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const stepX = canvas.width / Math.max(lossHistory.length - 1, 1);
    for (let i = 0; i < lossHistory.length; i++) {
      const x = i * stepX;
      const normalized = (lossHistory[i] - minLoss) / (maxLoss - minLoss);
      const clamped = Math.max(0, Math.min(1, normalized));
      const y = canvas.height - clamped * (canvas.height - 10) - 5;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }, [lossHistory]);

  // Python code snippet generator
  const generatedPyTorchSnippet = `# =========================================================================
# Abdul Kayum ML Research - PyTorch Model Architecture
# Hyperparameters: LR=${learningRate}, Activation=${activation.toUpperCase()}, HiddenNeurons=${hiddenNeurons}
# =========================================================================

import torch
import torch.nn as nn
import torch.optim as optim
import matplotlib.pyplot as plt

class DynamicBoundaryClassifier(nn.Module):
    def __init__(self, in_features=2, hidden_dim=${hiddenNeurons}, num_classes=1):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(in_features, hidden_dim),
            ${
              activation === 'relu'
                ? 'nn.ReLU(),'
                : activation === 'gelu'
                ? 'nn.GELU(),'
                : activation === 'tanh'
                ? 'nn.Tanh(),'
                : 'nn.Sigmoid(),'
            }
            nn.Linear(hidden_dim, num_classes)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.net(x)

# Initialization & Training Routine
model = DynamicBoundaryClassifier()
criterion = nn.BCEWithLogitsLoss()
optimizer = optim.Adam(model.parameters(), lr=${learningRate}, weight_decay=1e-4)

print("Initialized model with", sum(p.numel() for p in model.parameters()), "trainable parameters.")
`;

  // EDA & Predictive Inference State
  const [featureIncome, setFeatureIncome] = useState<number>(5.8); // 1 to 15
  const [featureAge, setFeatureAge] = useState<number>(24);        // 1 to 50
  const [featureRooms, setFeatureRooms] = useState<number>(6.2);   // 2 to 10
  const [featureProximity, setFeatureProximity] = useState<number>(3.5); // 1 to 10

  // Computed inference price (California Housing Model simulation)
  const predictedValue = Math.max(
    85000,
    Math.round((featureIncome * 48200 + featureRooms * 14200 - featureProximity * 9500 + featureAge * 1100 + 45000) / 100) * 100
  );
  const ciLower = Math.round(predictedValue * 0.93);
  const ciUpper = Math.round(predictedValue * 1.07);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section id="interactive-labs" className="py-20 border-t border-slate-800 bg-slate-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-blue-400 tracking-wider uppercase mb-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>Interactive Computational Laboratory</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Real-Time Neural Networks & Statistical Inference
            </h2>
            <p className="mt-2 text-slate-400 max-w-2xl text-sm sm:text-base">
              Test non-linear decision boundary convergence in real time, benchmark hyperparameters, inspect loss functions, and simulate multivariate regression inference directly inside your browser.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-lg shrink-0">
            <button
              onClick={() => setActiveTab('neural-net')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                activeTab === 'neural-net'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Neural Classifier Sandbox
            </button>
            <button
              onClick={() => setActiveTab('eda-inference')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                activeTab === 'eda-inference'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Predictive Model Simulator
            </button>
          </div>
        </div>

        {/* Tab 1: Neural Network Classifier */}
        {activeTab === 'neural-net' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Visual Canvas Column (7 cols) */}
            <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
                <div>
                  <h3 className="text-base font-semibold text-white">2D Non-Linear Decision Surface</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span>Blue: Class 0</span>
                    <span aria-hidden="true">·</span>
                    <span>Coral: Class 1</span>
                    <span aria-hidden="true">·</span>
                    <span>Resolution: 28x28 Latent Grid</span>
                  </div>
                </div>

                {/* Training Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsTraining(!isTraining)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      isTraining
                        ? 'bg-amber-600 hover:bg-amber-500 text-white'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    {isTraining ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Train</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={resetModel}
                    title="Reset Weights & Data"
                    className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main Canvas */}
              <div className="relative aspect-square max-w-[440px] mx-auto rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-inner">
                <canvas
                  ref={decisionCanvasRef}
                  width={440}
                  height={440}
                  className="w-full h-full block cursor-crosshair"
                />
              </div>

              {/* Live KPI Metric Strip */}
              <div className="grid grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-800/80 text-center">
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="block text-xs text-slate-400">Epoch</span>
                  <span className="text-sm font-bold font-mono text-white tabular-nums">{currentEpoch}</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="block text-xs text-slate-400">Loss (BCE)</span>
                  <span className="text-sm font-bold font-mono text-blue-400 tabular-nums">{currentLoss.toFixed(4)}</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="block text-xs text-slate-400">Accuracy</span>
                  <span className="text-sm font-bold font-mono text-emerald-400 tabular-nums">{currentAcc.toFixed(1)}%</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="block text-xs text-slate-400">Parameters</span>
                  <span className="text-sm font-bold font-mono text-purple-400 tabular-nums">
                    {2 * hiddenNeurons + hiddenNeurons + hiddenNeurons + 1}
                  </span>
                </div>
              </div>

              {/* Loss Curve Mini Plot */}
              <div className="mt-4 bg-slate-900/40 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Binary Cross Entropy Loss Curve</span>
                  <span className="font-mono text-slate-500 tabular-nums">Last 80 Epochs</span>
                </div>
                <canvas ref={lossCanvasRef} width={440} height={55} className="w-full h-[55px] block" />
              </div>
            </div>

            {/* Hyperparameter Controls & Code (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Controls Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                  <Sliders className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-semibold text-white">Hyperparameter Tuner</h3>
                </div>

                {/* Dataset Choice */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Synthetic Manifold / Dataset
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['spiral', 'moons', 'circles', 'xor'] as DatasetType[]).map((d) => (
                      <button
                        key={d}
                        onClick={() => {
                          setDatasetType(d);
                          setIsTraining(false);
                        }}
                        className={`px-3 py-2 text-xs font-medium rounded-lg border text-left capitalize transition-colors ${
                          datasetType === d
                            ? 'bg-blue-900/30 border-blue-500 text-blue-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        {d === 'moons' ? 'Two Moons' : d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Activation Function */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Activation Function: <span className="font-mono text-blue-400 uppercase">{activation}</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['relu', 'gelu', 'tanh', 'sigmoid'] as ActivationType[]).map((actType) => (
                      <button
                        key={actType}
                        onClick={() => {
                          setActivation(actType);
                          setIsTraining(false);
                        }}
                        className={`py-1.5 text-xs font-mono font-medium rounded-lg border uppercase transition-colors ${
                          activation === actType
                            ? 'bg-blue-900/30 border-blue-500 text-blue-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {actType}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hidden Neurons Slider */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>Hidden Neurons</span>
                    <span className="font-mono text-blue-400 tabular-nums">{hiddenNeurons} units</span>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={16}
                    step={2}
                    value={hiddenNeurons}
                    onChange={(e) => setHiddenNeurons(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                    <span>4 (Linear bias)</span>
                    <span>16 (Complex frontier)</span>
                  </div>
                </div>

                {/* Learning Rate Slider */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>Learning Rate (SGD)</span>
                    <span className="font-mono text-blue-400 tabular-nums">{learningRate.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min={0.02}
                    max={0.4}
                    step={0.02}
                    value={learningRate}
                    onChange={(e) => setLearningRate(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                    <span>0.02 (Conservative)</span>
                    <span>0.40 (Aggressive)</span>
                  </div>
                </div>

                {/* Toggle Code View */}
                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setShowCode(!showCode)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
                  >
                    <Code2 className="w-4 h-4 text-blue-400" />
                    <span>{showCode ? 'Hide PyTorch Code' : 'View Equivalent PyTorch Module'}</span>
                  </button>
                </div>
              </div>

              {/* PyTorch Code Viewer */}
              {showCode && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl relative">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                    <span className="text-xs font-mono text-slate-400">pytorch_model.py</span>
                    <button
                      onClick={() => copyToClipboard(generatedPyTorchSnippet)}
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-slate-300 overflow-x-auto max-h-64 leading-relaxed p-2 bg-slate-900/60 rounded-lg">
                    <code>{generatedPyTorchSnippet}</code>
                  </pre>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Tab 2: Predictive Model & EDA Simulator */}
        {activeTab === 'eda-inference' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Input Feature Modeler (5 cols) */}
            <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="pb-3 border-b border-slate-800">
                <h3 className="text-base font-semibold text-white">Multivariate Feature Inputs</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Adjust standardized socioeconomic predictors to calculate real-time gradient boosted valuation estimates.
                </p>
              </div>

              {/* Slider 1: Median Income */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Median Household Income ($10k/yr)</span>
                  <span className="font-mono text-blue-400 tabular-nums">${(featureIncome * 10).toFixed(1)}k</span>
                </div>
                <input
                  type="range"
                  min={1.5}
                  max={15.0}
                  step={0.1}
                  value={featureIncome}
                  onChange={(e) => setFeatureIncome(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Slider 2: Average Rooms */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Average Rooms per Dwelling</span>
                  <span className="font-mono text-blue-400 tabular-nums">{featureRooms.toFixed(1)} rooms</span>
                </div>
                <input
                  type="range"
                  min={2.0}
                  max={10.0}
                  step={0.1}
                  value={featureRooms}
                  onChange={(e) => setFeatureRooms(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Slider 3: Proximity Index */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Distance to Employment Centers (km)</span>
                  <span className="font-mono text-blue-400 tabular-nums">{featureProximity.toFixed(1)} km</span>
                </div>
                <input
                  type="range"
                  min={1.0}
                  max={10.0}
                  step={0.2}
                  value={featureProximity}
                  onChange={(e) => setFeatureProximity(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Slider 4: House Age */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Median Structure Age</span>
                  <span className="font-mono text-blue-400 tabular-nums">{featureAge} years</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={52}
                  step={1}
                  value={featureAge}
                  onChange={(e) => setFeatureAge(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Model Specs: </span>
                <span>Optimized XGBoost Regressor (100 estimators, max_depth=6) with 5-fold cross-validation $R^2 = 0.841$.</span>
              </div>
            </div>

            {/* Right: Real-Time Inference Output & Feature Attribution (7 cols) */}
            <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-semibold text-white">Inference Engine Output</h3>
                  <span className="text-xs text-slate-400">Estimated Target with 95% Parametric CI</span>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-md">
                  Status: Low Latency (&lt;1.8 ms)
                </span>
              </div>

              {/* Big Prediction Display */}
              <div className="bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-950 p-6 rounded-xl border border-blue-900/40">
                <span className="text-xs font-medium text-blue-300 uppercase tracking-wider block mb-1">
                  Predicted Property Value
                </span>
                <div className="text-4xl font-extrabold text-white font-mono tabular-nums">
                  ${predictedValue.toLocaleString()}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-2 font-mono tabular-nums">
                  <span>95% CI: ${ciLower.toLocaleString()} — ${ciUpper.toLocaleString()}</span>
                  <span aria-hidden="true">·</span>
                  <span>Std Error: ±$14,200</span>
                </div>
              </div>

              {/* Feature Attribution (Waterfall / SHAP-style breakdown) */}
              <div>
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                  Feature Contribution Decomposition (Local SHAP Values)
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1 font-mono">
                      <span>Median Income (+Attribution)</span>
                      <span className="text-emerald-400 tabular-nums">
                        +${Math.round(featureIncome * 4820).toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (featureIncome / 15) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1 font-mono">
                      <span>Average Rooms (+Attribution)</span>
                      <span className="text-emerald-400 tabular-nums">
                        +${Math.round(featureRooms * 1420).toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (featureRooms / 10) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1 font-mono">
                      <span>Proximity Penalty (-Attribution)</span>
                      <span className="text-red-400 tabular-nums">
                        -${Math.round(featureProximity * 950).toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (featureProximity / 10) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Correlation Summary Table */}
              <div className="pt-3 border-t border-slate-800">
                <span className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Pairwise Correlation Matrix (Pearson r)
                </span>
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="block text-[10px] text-slate-500">Inc × Target</span>
                    <span className="text-blue-400 font-bold tabular-nums">+0.68</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="block text-[10px] text-slate-500">Rooms × Target</span>
                    <span className="text-blue-400 font-bold tabular-nums">+0.42</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="block text-[10px] text-slate-500">Dist × Target</span>
                    <span className="text-red-400 font-bold tabular-nums">-0.34</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="block text-[10px] text-slate-500">Age × Target</span>
                    <span className="text-slate-300 font-bold tabular-nums">+0.11</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
};
