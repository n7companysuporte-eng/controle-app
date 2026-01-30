"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

/* ===== CONFIG ===== */
const CATEGORIES = [
  "Alimentação",
  "Lazer",
  "Moradia",
  "Transporte",
  "Assinaturas",
  "Saúde",
  "Outros",
];

const MESSAGES_EXPENSE = [
  "💸 Gastou… mas tá no controle!",
  "😅 Esse saiu do caixa!",
  "⚠️ Olho no orçamento!",
  "📉 Saldo deu uma mexida",
  "🧾 Registrado com sucesso!",
];

const MESSAGES_INCOME = [
  "💰 Dinheiro entrou!",
  "📈 Saldo subindo!",
  "🔥 Boa! Caixa feliz!",
  "🚀 Receita confirmada!",
  "👏 Ótima entrada!",
];

export default function FinanceSaaS() {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  const income = useMemo(
    () => items.filter(i => i.type === "income").reduce((a,b)=>a+b.value,0),
    [items]
  );

  const expense = useMemo(
    () => items.filter(i => i.type === "expense").reduce((a,b)=>a+b.value,0),
    [items]
  );

  const balance = income - expense;

  const chartData = CATEGORIES.map(cat => ({
    name: cat,
    value: items
      .filter(i => i.category === cat)
      .reduce((a,b)=>a+b.value,0)
  })).filter(c => c.value > 0);

  function addItem(type) {
    const value = Number(prompt("Valor:"));
    const category = prompt(`Categoria:\n${CATEGORIES.join(", ")}`);
    if (!value || !category) return;

    setItems([
      ...items,
      { id: Date.now(), value, category, type }
    ]);

    setMessage(
      type === "income"
        ? MESSAGES_INCOME[Math.floor(Math.random()*MESSAGES_INCOME.length)]
        : MESSAGES_EXPENSE[Math.floor(Math.random()*MESSAGES_EXPENSE.length)]
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-yellow-400 p-4 text-white">
      
      <motion.h1 
        initial={{opacity:0, y:-10}}
        animate={{opacity:1, y:0}}
        className="text-xl font-bold mb-4"
      >
        Finance SaaS
      </motion.h1>

      {/* SALDO */}
      <div className="bg-white text-black rounded-2xl p-5 shadow-xl mb-4">
        <p className="text-sm text-gray-500">Saldo do mês</p>
        <h2 className={`text-3xl font-bold ${balance >= 0 ? "text-green-600":"text-red-600"}`}>
          R$ {balance.toFixed(2)}
        </h2>

        <div className="flex gap-3 mt-4">
          <motion.button
            whileTap={{scale:0.95}}
            onClick={()=>addItem("income")}
            className="flex-1 bg-green-600 text-white py-4 rounded-xl flex justify-center items-center gap-2 text-lg"
          >
            <Plus /> Receita
          </motion.button>

          <motion.button
            whileTap={{scale:0.95}}
            onClick={()=>addItem("expense")}
            className="flex-1 bg-red-500 text-white py-4 rounded-xl flex justify-center items-center gap-2 text-lg"
          >
            <Minus /> Gasto
          </motion.button>
        </div>

        {message && (
          <motion.p
            initial={{opacity:0}}
            animate={{opacity:1}}
            className="mt-3 text-center font-medium"
          >
            {message}
          </motion.p>
        )}
      </div>

      {/* GRÁFICO */}
      <div className="bg-white text-black rounded-2xl p-4 shadow h-64">
        <p className="font-semibold mb-2">Gastos por categoria</p>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={chartData} dataKey="value">
              {chartData.map((_,i)=>(
                <Cell key={i} fill={["#16a34a","#22c55e","#4ade80","#fde047"][i%4]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
