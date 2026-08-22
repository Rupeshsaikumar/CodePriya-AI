import { ProjectData } from '../types';

export const DEMO_PROJECTS: ProjectData[] = [
  {
    id: 'demo-fintech-gateway',
    name: 'Multi-Chain DeFi Payment Gateway',
    description: 'Autonomous microservice for decentralized cross-chain crypto payments with real-time liquidity routing and slippage protection.',
    uploadType: 'demo',
    problemStatement: 'Construct an autonomous microservice for decentralized cross-chain crypto payments with real-time liquidity routing and slippage protection.',
    repositoryUrl: 'https://github.com/codepriya-ai/multichain-defi-gateway',
    totalFiles: 8,
    totalLines: 1240,
    languages: { TypeScript: 65, Solidity: 25, Rust: 10 },
    fileTree: {
      'src': {
        'services': {
          'PaymentRouter.ts': null,
          'SlippageEngine.ts': null,
          'LiquidityPoolScanner.ts': null
        },
        'contracts': {
          'PaymentVault.sol': null,
          'CrossChainBridge.sol': null
        },
        'api': {
          'routes.ts': null
        }
      },
      'server.ts': null,
      'package.json': null
    },
    files: [
      {
        path: 'src/services/PaymentRouter.ts',
        name: 'PaymentRouter.ts',
        size: 3450,
        language: 'typescript',
        lineCount: 145,
        content: `import { SlippageEngine } from './SlippageEngine';
import { LiquidityPoolScanner } from './LiquidityPoolScanner';

export interface RouteRequest {
  sourceChain: string;
  targetChain: string;
  tokenAddress: string;
  amountWei: string;
  maxSlippageBps: number;
}

export class PaymentRouter {
  private slippageEngine = new SlippageEngine();
  private poolScanner = new LiquidityPoolScanner();

  async findOptimalRoute(request: RouteRequest) {
    const pools = await this.poolScanner.scanActivePools(request.sourceChain, request.targetChain);
    const executionPrice = await this.slippageEngine.calculatePriceImpact(request.amountWei, pools);
    
    if (executionPrice.slippageBps > request.maxSlippageBps) {
      throw new Error(\`Slippage limit exceeded: \${executionPrice.slippageBps} BPS\`);
    }

    return {
      bestPool: pools[0],
      estimatedGasGwei: 28,
      netAmountOut: executionPrice.netOutputAmount,
      routePath: [request.sourceChain, 'BridgeNode-01', request.targetChain]
    };
  }
}`
      },
      {
        path: 'src/services/SlippageEngine.ts',
        name: 'SlippageEngine.ts',
        size: 2800,
        language: 'typescript',
        lineCount: 95,
        content: `export class SlippageEngine {
  // Calculates quadratic price impact for AMM constant product formula
  async calculatePriceImpact(amountWei: string, poolData: any[]) {
    const amount = BigInt(amountWei);
    const reserveIn = BigInt(poolData[0]?.reserve0 || "1000000000000000000000");
    const reserveOut = BigInt(poolData[0]?.reserve1 || "500000000000000000000");

    // Constant product formula: dx * dy = k
    const amountWithFee = amount * BigInt(997);
    const numerator = amountWithFee * reserveOut;
    const denominator = (reserveIn * BigInt(1000)) + amountWithFee;
    const netOutputAmount = numerator / denominator;

    const priceImpactRatio = Number(amount) / Number(reserveIn);
    const slippageBps = Math.round(priceImpactRatio * 10000);

    return {
      netOutputAmount: netOutputAmount.toString(),
      slippageBps: Math.min(slippageBps, 500)
    };
  }
}`
      },
      {
        path: 'src/contracts/PaymentVault.sol',
        name: 'PaymentVault.sol',
        size: 2100,
        language: 'solidity',
        lineCount: 78,
        content: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract PaymentVault {
    address public owner;
    mapping(bytes32 => bool) public processedTx;

    event PaymentSettled(bytes32 indexed txHash, address indexed user, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    function settlePayment(
        address token,
        uint256 amount,
        bytes32 txHash
    ) external {
        require(!processedTx[txHash], "Already processed");
        processedTx[txHash] = true;
        
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Transfer failed");
        emit PaymentSettled(txHash, msg.sender, amount);
    }
}`
      },
      {
        path: 'src/server.ts',
        name: 'server.ts',
        size: 1900,
        language: 'typescript',
        lineCount: 65,
        content: `import express from 'express';
import { PaymentRouter } from './services/PaymentRouter';

const app = express();
app.use(express.json());

const router = new PaymentRouter();

app.post('/api/route', async (req, res) => {
  try {
    const result = await router.findOptimalRoute(req.body);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.listen(3000, () => console.log('Payment Gateway listening on port 3000'));`
      }
    ]
  },
  {
    id: 'demo-ai-ecommerce',
    name: 'Multilingual AI E-Commerce Platform',
    description: 'Next-gen e-commerce storefront with personalized AI recommendations, dynamic multi-language chat support, and automated inventory sync.',
    uploadType: 'demo',
    problemStatement: 'Develop a full-stack e-commerce web application with product catalog, cart management, user authentication, and secure Stripe/PayPal payment gateway integration.',
    repositoryUrl: 'https://github.com/codepriya-ai/ai-multilingual-ecommerce',
    totalFiles: 12,
    totalLines: 1850,
    languages: { TypeScript: 70, JSX: 20, CSS: 10 },
    fileTree: {
      'src': {
        'components': {
          'ProductGrid.tsx': null,
          'AIChatWidget.tsx': null,
          'CartDrawer.tsx': null
        },
        'services': {
          'geminiRecommender.ts': null,
          'paymentService.ts': null
        },
        'App.tsx': null
      },
      'server.ts': null
    },
    files: [
      {
        path: 'src/services/geminiRecommender.ts',
        name: 'geminiRecommender.ts',
        size: 2900,
        language: 'typescript',
        lineCount: 92,
        content: `import { GoogleGenAI } from '@google/genai';

export class AIRecommender {
  private ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  async generateProductRecommendations(userHistory: string[], language: string = 'en') {
    const prompt = \`User browsing history: \${userHistory.join(', ')}. 
Recommend 3 complementary e-commerce items in JSON format with title, price, reason. Language: \${language}\`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    return JSON.parse(response.text || '[]');
  }
}`
      },
      {
        path: 'src/components/AIChatWidget.tsx',
        name: 'AIChatWidget.tsx',
        size: 3200,
        language: 'typescript',
        lineCount: 110,
        content: `import React, { useState } from 'react';

export const AIChatWidget = () => {
  const [messages, setMessages] = useState<{sender: string, text: string}[]>([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input) return;
    const userMsg = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');

    const res = await fetch('/api/chat-recommend', {
      method: 'POST',
      body: JSON.stringify({ message: userMsg })
    });
    const data = await res.json();
    setMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
  };

  return (
    <div className="p-4 border rounded-xl shadow-lg bg-white">
      <h3 className="font-bold text-lg mb-2">CodePriya AI Shopping Buddy</h3>
      <div className="h-60 overflow-y-auto space-y-2 mb-2">
        {messages.map((m, i) => (
          <div key={i} className={\`p-2 rounded \${m.sender === 'user' ? 'bg-indigo-50 text-right' : 'bg-gray-100'}\`}>
            {m.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="border p-2 flex-1 rounded" value={input} onChange={e => setInput(e.target.value)} placeholder="Ask in Telugu or English..." />
        <button onClick={handleSend} className="bg-indigo-600 text-white px-4 py-2 rounded">Send</button>
      </div>
    </div>
  );
};`
      }
    ]
  },
  {
    id: 'demo-healthcare-ai',
    name: 'Hackathon Diagnostics AI Agent',
    description: 'Medical image triage & symptom analyzer with vector semantic search, explainable AI diagnosis, and emergency priority rating.',
    uploadType: 'demo',
    repositoryUrl: 'https://github.com/codepriya-ai/med-ai-diagnostics',
    totalFiles: 10,
    totalLines: 1560,
    languages: { Python: 55, TypeScript: 35, SQL: 10 },
    fileTree: {
      'agent': {
        'symptom_analyzer.py': null,
        'vector_indexer.py': null,
        'triage_evaluator.py': null
      },
      'api': {
        'server.ts': null
      }
    },
    files: [
      {
        path: 'agent/symptom_analyzer.py',
        name: 'symptom_analyzer.py',
        size: 3100,
        language: 'python',
        lineCount: 105,
        content: `import os
from google import genai

class HealthDiagnosticAgent:
    def __init__(self):
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    def analyze_patient_case(self, symptoms: str, vitals: dict) -> dict:
        prompt = f"""
        Patient Symptoms: {symptoms}
        Vitals: {vitals}
        Provide triage score (1-5), urgency level, differential diagnosis list, and recommended clinical next steps.
        Output MUST be strictly JSON.
        """
        response = self.client.models.generate_content(
            model='gemini-3.6-flash',
            contents=prompt,
            config={'response_mime_type': 'application/json'}
        )
        return response.text`
      }
    ]
  }
];
