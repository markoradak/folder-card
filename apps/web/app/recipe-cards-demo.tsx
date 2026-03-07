"use client";

import {
  FolderCardGroup,
  FolderCard,
  FolderCardItem,
} from "@markoradak/folder-card";
import { CloseButtonIcon } from "./close-button-icon";

const RECIPES = [
  {
    id: "pasta",
    name: "Lemon Herb Pasta",
    time: "25 min",
    difficulty: "Easy",
    gradient: "from-amber-400 to-orange-500",
    emoji: "\uD83C\uDF4B",
    ingredients: ["Linguine", "Lemon zest", "Garlic", "Parmesan", "Fresh herbs", "Olive oil"],
    steps: ["Boil pasta until al dente", "Saut\u00E9 garlic in olive oil", "Toss with lemon zest and herbs", "Finish with parmesan"],
    nutrition: { calories: "420", protein: "14g", carbs: "58g", fat: "16g" },
  },
  {
    id: "bowl",
    name: "Teriyaki Rice Bowl",
    time: "35 min",
    difficulty: "Medium",
    gradient: "from-rose-400 to-pink-500",
    emoji: "\uD83C\uDF5A",
    ingredients: ["Jasmine rice", "Tofu", "Teriyaki sauce", "Edamame", "Avocado", "Sesame seeds"],
    steps: ["Cook rice and press tofu", "Pan-fry tofu until golden", "Assemble bowl with toppings", "Drizzle teriyaki sauce"],
    nutrition: { calories: "510", protein: "22g", carbs: "65g", fat: "18g" },
  },
  {
    id: "salad",
    name: "Mediterranean Salad",
    time: "15 min",
    difficulty: "Easy",
    gradient: "from-emerald-400 to-teal-500",
    emoji: "\uD83E\uDD57",
    ingredients: ["Mixed greens", "Cucumber", "Cherry tomatoes", "Feta", "Olives", "Red onion"],
    steps: ["Chop all vegetables", "Crumble feta cheese", "Toss with olive oil and lemon", "Season with oregano"],
    nutrition: { calories: "280", protein: "10g", carbs: "18g", fat: "20g" },
  },
];

function CardFace({ recipe }: { recipe: (typeof RECIPES)[number] }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-(--fc-radius,1rem)">
      <FolderCardItem>
        <div
          className={`flex h-24 items-center justify-center bg-gradient-to-br ${recipe.gradient}`}
        >
          <span className="text-4xl">{recipe.emoji}</span>
        </div>
      </FolderCardItem>

      <div className="flex flex-col gap-3 p-5">
        <FolderCardItem>
          <p className="text-sm font-semibold text-foreground">{recipe.name}</p>
        </FolderCardItem>

        <FolderCardItem>
          <div className="flex gap-3">
            <span className="inline-flex items-center rounded-full border border-border/40 bg-foreground/[0.03] px-2.5 py-1 text-[11px] text-muted dark:border-white/[0.08] dark:bg-white/[0.04]">
              {recipe.time}
            </span>
            <span className="inline-flex items-center rounded-full border border-border/40 bg-foreground/[0.03] px-2.5 py-1 text-[11px] text-muted dark:border-white/[0.08] dark:bg-white/[0.04]">
              {recipe.difficulty}
            </span>
          </div>
        </FolderCardItem>
      </div>
    </div>
  );
}

function CardDetail({
  recipe,
  close,
}: {
  recipe: (typeof RECIPES)[number];
  close: () => void;
}) {
  return (
    <div className="relative flex flex-col gap-5">
      <CloseButtonIcon
        onClick={close}
        className="absolute right-2 top-2 z-10 flex size-9 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:text-white"
      />

      <FolderCardItem>
        <div
          className={`flex h-28 items-end bg-gradient-to-br p-5 ${recipe.gradient}`}
        >
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white">
              {recipe.name}
            </h2>
            <div className="mt-1 flex gap-2">
              <span className="text-xs text-white/80">{recipe.time}</span>
              <span className="text-xs text-white/50">&middot;</span>
              <span className="text-xs text-white/80">{recipe.difficulty}</span>
            </div>
          </div>
        </div>
      </FolderCardItem>

      <div className="flex flex-col gap-5 px-5 pb-5">
        <FolderCardItem>
          <div>
            <p className="mb-2 text-[11px] font-medium text-muted/60">Ingredients</p>
            <div className="flex flex-wrap gap-1.5">
              {recipe.ingredients.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border/40 bg-foreground/[0.03] px-2.5 py-1 text-xs text-muted dark:border-white/[0.08] dark:bg-white/[0.04]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </FolderCardItem>

        <FolderCardItem>
          <div>
            <p className="mb-2 text-[11px] font-medium text-muted/60">Steps</p>
            <div className="flex flex-col gap-2">
              {recipe.steps.map((step, i) => (
                <div key={step} className="flex gap-2.5">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-foreground/[0.05] text-[10px] font-medium text-muted dark:bg-white/[0.06]">
                    {i + 1}
                  </span>
                  <p className="text-sm text-muted">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </FolderCardItem>

        <FolderCardItem>
          <div className="grid grid-cols-4 gap-3 rounded-[12px] border border-border/40 bg-foreground/[0.02] p-3 dark:border-white/[0.06] dark:bg-white/[0.02]">
            {Object.entries(recipe.nutrition).map(([key, val]) => (
              <div key={key} className="text-center">
                <p className="text-sm font-semibold tabular-nums text-foreground">
                  {val}
                </p>
                <p className="mt-0.5 text-[10px] capitalize text-muted/60">
                  {key}
                </p>
              </div>
            ))}
          </div>
        </FolderCardItem>
      </div>
    </div>
  );
}

export function RecipeCardsDemo() {
  return (
    <FolderCardGroup>
      <div className="grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {RECIPES.map((recipe) => (
          <FolderCard
            key={recipe.id}
            id={recipe.id}
            liveRadius
            hingeSide="left"
            notchPosition="bottom-right"
            renderLid={() => <CardFace recipe={recipe} />}
            renderDetail={(close) => (
              <CardDetail recipe={recipe} close={close} />
            )}
            renderTab={() => (
              <div className="pr-3 pt-2 pb-2.5 pl-4">
                <div className="flex items-center gap-1.5 rounded-full border border-border/40 bg-card px-2.5 py-1 text-[11px] font-medium text-muted transition-all duration-300 ease-out group-hover:border-foreground/30 group-hover:text-foreground dark:border-white/[0.1] dark:group-hover:border-white/[0.2]">
                  <span>{recipe.emoji}</span>
                  <span>{recipe.time}</span>
                </div>
              </div>
            )}
          />
        ))}
      </div>
    </FolderCardGroup>
  );
}
