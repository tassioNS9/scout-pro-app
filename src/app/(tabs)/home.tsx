import { MaterialCommunityIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import { LinearGradient } from "expo-linear-gradient";
import { Link, type Href } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
type CardItem = {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: Href;
  // [cor inicial, cor final] - equivalente ao from-*-600 to-*-700 do Tailwind
  colors: readonly [string, string];
};

const cards: CardItem[] = [
  {
    title: "Times",
    description: "Cadastre e gerencie seus times",
    icon: (
      <MaterialCommunityIcons
        name="shield-half-full"
        size={72}
        color="#ffffff"
      />
    ), // ShieldHalf
    href: "/times",
    colors: ["#16a34a", "#15803d"], // green-600 -> green-700
  },
  {
    title: "Jogadores",
    description: "Registre eventos em tempo real",
    icon: <Entypo name="user" size={72} color="#ffffff" />, // Zap
    href: "/scout",
    colors: ["#429E53", "#264723"], // green-600 -> green-700
  },
  {
    title: "Scout ao Vivo",
    description: "Registre eventos em tempo real",
    icon: <AntDesign name="aim" size={72} color="#ffffff" />, // Zap
    href: "/scout",
    colors: ["#00D4FF", "#090979"], // purple
  },
  {
    title: "Dashboard",
    description: "Visualize estatísticas e análises",
    icon: <MaterialCommunityIcons name="chart-bar" size={72} color="#ffffff" />, // BarChart3
    href: "/dashboard",
    colors: ["#ea580c", "#c2410c"], // orange
  },
  {
    title: "Relatórios",
    description: "Gere e exporte relatórios",
    icon: (
      <MaterialCommunityIcons name="file-document" size={72} color="#ffffff" />
    ), // FileText
    href: "/registros",
    colors: ["#db2777", "#be185d"], // pink
  },
  {
    title: "Análise Tática",
    description: "Análise automática de formações",
    icon: <Ionicons name="grid" size={72} color="#ffffff" />, // Grid3x3
    href: "/tactical-board",
    colors: ["#0d9488", "#0f766e"], // teal
  },
  {
    title: "Configurações",
    description: "Análise automática de formações",
    icon: <Ionicons name="settings" size={72} color="#ffffff" />, // Grid3x3
    href: "/config",
    colors: ["#9696AB", "#404A4A"], // teal
  },
  {
    title: "Backup",
    description: "Guarde e restaure seus dados",
    icon: <Ionicons name="cloud-upload" size={72} color="#ffffff" />, // CloudUpload
    href: "/backup",
    colors: ["#2563eb", "#1d4ed8"], // blue
  },
];

export const Home = () => {
  const { width } = useWindowDimensions();

  // grid-cols-2 no mobile, lg:grid-cols-4 em telas grandes (tablet)
  const columns = width >= 1024 ? 4 : 2;
  const isTablet = width >= 768; // equivalente ao "md:" para exibir a descrição

  return (
    <ScrollView
      className="flex-1 bg-black/80"
      contentContainerClassName="p-6 lg:p-8"
      showsVerticalScrollIndicator={false}
    >
      {/* O gap do grid é simulado com padding em cada item + margem negativa no container */}
      <View className="flex-1  z-50 border-b border-green-900  shadow-black/50">
        <View className="flex flex-row  justify-between gap-2 px-8 py-4">
          <View className="  gap-2">
            <Text className="text-background text-sm font-bold">
              SCOUT CAMPO PRO
            </Text>
          </View>

          <View className=" gap-2  ">
            <Text className="text-background text-sm font-bold">v1.0.0</Text>
          </View>
        </View>
      </View>
      <View className="-mx-3 mb-12 flex-row flex-wrap ">
        {cards.map((card) => (
          <View
            key={card.title}
            className="p-1"
            style={{ width: `${100 / columns}%` }}
          >
            <Link href={card.href} asChild>
              <Button
                variant="ghost"
                className="relative h-auto w-full overflow-hidden rounded-xl border border-border/40 p-0 shadow-lg active:scale-[0.98]"
              >
                <LinearGradient
                  colors={card.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[StyleSheet.absoluteFill, { opacity: 0.95 }]}
                />

                <View className="z-10 w-full items-center p-6">
                  {card.icon}

                  <Text className="mb-2 text-center text-sm font-bold text-primary-foreground">
                    {card.title}
                  </Text>

                  {isTablet && (
                    <Text className="text-center text-sm text-primary-foreground/85">
                      {card.description}
                    </Text>
                  )}
                </View>

                {/* Círculo decorativo no canto */}
                <View className="absolute -right-10 -top-10 h-20 w-20 rounded-full bg-primary-foreground/15" />
              </Button>
            </Link>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Home;
