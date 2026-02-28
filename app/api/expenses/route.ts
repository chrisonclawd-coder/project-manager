import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'expenses.json');

interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string; // YYYY-MM-DD
  createdAt: string;
  category?: string;
}

function readExpenses(): Expense[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading expenses:', error);
  }
  return [];
}

function saveExpenses(expenses: Expense[]): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(expenses, null, 2));
}

// Parse expense from Telegram-style message
// Formats: "E 125 Milk", "E -125 - Milk", "E 125 Milk 2026-02-28"
function parseExpenseMessage(text: string): { amount: number; description: string; date: string } | null {
  // Remove "E" or "e" prefix
  let cleaned = text.replace(/^[Ee]\s*/, '').trim();
  
  // Default date (today)
  const today = new Date().toISOString().split('T')[0];
  let date = today;
  
  // Check for date at end (YYYY-MM-DD or DD-MM-YYYY or just date-like pattern)
  const dateMatch = cleaned.match(/(\d{4}-\d{2}-\d{2})$/);
  if (dateMatch) {
    date = dateMatch[1];
    cleaned = cleaned.replace(dateMatch[0], '').trim();
  }
  
  // Try different amount formats
  // Format 1: "125 Milk" (positive = expense)
  // Format 2: "-125 - Milk" (negative = income/refund)
  // Format 3: "125 - Milk"
  
  let amount: number;
  let description: string;
  
  // Check for negative amount first: "-125 - Milk"
  const negativeMatch = cleaned.match(/^-\s*(\d+(?:\.\d+)?)\s*-\s*(.+)$/);
  if (negativeMatch) {
    amount = -Math.abs(parseFloat(negativeMatch[1]));
    description = negativeMatch[2].trim();
  } else {
    // Check for "125 - Milk" format
    const withDash = cleaned.match(/^(\d+(?:\.\d+)?)\s*-\s*(.+)$/);
    if (withDash) {
      amount = parseFloat(withDash[1]);
      description = withDash[2].trim();
    } else {
      // Simple format: "125 Milk"
      const simple = cleaned.match(/^(\d+(?:\.\d+)?)\s+(.+)$/);
      if (simple) {
        amount = parseFloat(simple[1]);
        description = simple[2].trim();
      } else {
        return null; // Can't parse
      }
    }
  }
  
  if (!amount || !description) return null;
  
  return { amount, description, date };
}

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase();
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const category = searchParams.get('category');
  
  let expenses = readExpenses();
  
  // Filter
  if (query) {
    expenses = expenses.filter(e => 
      e.description.toLowerCase().includes(query) ||
      e.category?.toLowerCase().includes(query)
    );
  }
  
  if (startDate) {
    expenses = expenses.filter(e => e.date >= startDate);
  }
  
  if (endDate) {
    expenses = expenses.filter(e => e.date <= endDate);
  }
  
  if (category) {
    expenses = expenses.filter(e => e.category === category);
  }
  
  // Sort by date descending
  expenses.sort((a, b) => b.date.localeCompare(a.date));
  
  // Calculate summary
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const income = expenses.filter(e => e.amount > 0).reduce((sum, e) => sum + e.amount, 0);
  const expense = expenses.filter(e => e.amount < 0).reduce((sum, e) => sum + Math.abs(e.amount), 0);
  
  // Category breakdown
  const categoryBreakdown: Record<string, number> = {};
  expenses.forEach(e => {
    const cat = e.category || 'Uncategorized';
    categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + e.amount;
  });
  
  // Monthly breakdown
  const monthlyBreakdown: Record<string, number> = {};
  expenses.forEach(e => {
    const month = e.date.substring(0, 7); // YYYY-MM
    monthlyBreakdown[month] = (monthlyBreakdown[month] || 0) + e.amount;
  });
  
  return NextResponse.json({
    expenses,
    summary: {
      total,
      income,
      expense,
      count: expenses.length,
    },
    analysis: {
      categoryBreakdown,
      monthlyBreakdown,
      averagePerDay: expenses.length > 0 ? total / 30 : 0,
    }
  });
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { text, amount, description, date } = body;
    
    let newExpense: Expense;
    
    if (text) {
      // Parse from Telegram-style message
      const parsed = parseExpenseMessage(text);
      if (!parsed) {
        return NextResponse.json(
          { error: 'Invalid format. Use: E [amount] [description] or E -[amount] -[description]' },
          { status: 400 }
        );
      }
      newExpense = {
        id: Date.now().toString(),
        amount: parsed.amount,
        description: parsed.description,
        date: parsed.date,
        createdAt: new Date().toISOString(),
      };
    } else if (amount !== undefined && description) {
      // Direct API call
      newExpense = {
        id: Date.now().toString(),
        amount: parseFloat(amount),
        description,
        date: date || new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
      };
    } else {
      return NextResponse.json(
        { error: 'Provide either text or amount+description' },
        { status: 400 }
      );
    }
    
    const expenses = readExpenses();
    expenses.push(newExpense);
    saveExpenses(expenses);
    
    return NextResponse.json({ success: true, expense: newExpense });
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json(
      { error: 'Failed to create expense' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json(
      { error: 'Expense ID required' },
      { status: 400 }
    );
  }
  
  let expenses = readExpenses();
  const filtered = expenses.filter(e => e.id !== id);
  
  if (filtered.length === expenses.length) {
    return NextResponse.json(
      { error: 'Expense not found' },
      { status: 404 }
    );
  }
  
  saveExpenses(filtered);
  return NextResponse.json({ success: true });
}
