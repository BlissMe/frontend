import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";

const items = [
  { type: "rock", icon: "🪨", label: "Rock" },
  { type: "flower", icon: "🌸", label: "Flower" },
  { type: "tree", icon: "🌲", label: "Tree" },
  { type: "bamboo", icon: "🎋", label: "Bamboo" },
];

export function ZenGarden() {
  const [placedItems, setPlacedItems] = useState<
    Array<{ type: string; icon: string; x: number; y: number }>
  >([]);
  const [selectedItem, setSelectedItem] = useState(items[0]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPlacedItems([...placedItems, { ...selectedItem, x, y }]);
  };
  const navigate = useNavigate();

  const resetGarden = () => setPlacedItems([]);

  return (
    <div className="flex justify-center items-center min-h-[70vh] mt-20 ">
      <Card className="border-slate-300/20 bg-emerald-700 text-white w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle
            className="text-lg font-semibold text-white"
            style={{ fontFamily: "Merienda, cursive" }}
          >
            Zen Garden
          </CardTitle>
          <CardDescription className="text-slate-100 text-sm">
            Create a peaceful mini garden by placing elements 🌿
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex justify-center gap-4">
            {items.map((item) => (
              <motion.button
                key={item.type}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedItem(item)}
                title={item.label} // <-- Tooltip appears on hover
                className={`p-3 rounded-lg transition-colors ${
                  selectedItem.type === item.type
                    ? "bg-[#A6CCB333]"
                    : "bg-[#A6CCB30D]"
                }`}
              >
                <span className="text-4xl">{item.icon}</span>
              </motion.button>
            ))}
          </div>

          <div
            onClick={handleCanvasClick}
            className="relative w-full h-[320px] bg-emerald-100 rounded-lg cursor-pointer overflow-hidden border border-slate-700"
          >
            {placedItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 150 }}
                style={{
                  position: "absolute",
                  left: item.x - 18,
                  top: item.y - 18,
                }}
                className="text-4xl"
              >
                {item.icon}
              </motion.div>
            ))}
          </div>

          <div className="flex justify-between">
          <button
              onClick={() => navigate("/chat-new/text")}
              className=" bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-xl shadow"
            >
              ← Back to Chat
            </button>
            <Button
              onClick={resetGarden}
              className=" bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-xl shadow"
            >
              Reset Garden
            </Button>
           
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
