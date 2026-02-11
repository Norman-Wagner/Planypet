import { ScrollView, Text, View, Pressable, TextInput, Image, Alert, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { IconSymbol } from "@/components/ui/icon-symbol";

interface Post {
  id: string; userName: string; petName: string; content: string;
  image?: string; likes: number; comments: number; timestamp: string; isLiked: boolean;
}

const MOCK_POSTS: Post[] = [
  { id: "1", userName: "Maria Schmidt", petName: "Luna", content: "Erster Spaziergang nach dem Regen! Luna liebt Pfuetzen.", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400", likes: 24, comments: 5, timestamp: "vor 2 Stunden", isLiked: false },
  { id: "2", userName: "Thomas Mueller", petName: "Max", content: "Max hat heute seinen ersten Geburtstag gefeiert!", likes: 42, comments: 12, timestamp: "vor 5 Stunden", isLiked: true },
  { id: "3", userName: "Anna Weber", petName: "Mimi", content: "Kann jemand einen guten Tierarzt in Berlin empfehlen?", likes: 8, comments: 15, timestamp: "vor 1 Tag", isLiked: false },
];

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [newPost, setNewPost] = useState("");

  const toggleLike = (postId: string) => {
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p));
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40, paddingHorizontal: 20 }}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.6 }]}>
          <IconSymbol name="chevron.left" size={20} color="#D4A843" />
          <Text style={s.backText}>Zurueck</Text>
        </Pressable>
        <View style={s.header}>
          <Text style={s.headerTitle}>Community</Text>
          <Text style={s.headerSub}>Austausch mit Tierfreunden</Text>
          <View style={s.goldDivider} />
        </View>

        {/* Create Post */}
        <View style={s.card}>
          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
            <View style={s.avatar}><Text style={{ fontSize: 16, fontWeight: "300", color: "#D4A843" }}>Du</Text></View>
            <View style={{ flex: 1 }}>
              <TextInput value={newPost} onChangeText={setNewPost} placeholder="Was moechtest du teilen?" placeholderTextColor="#4A4A4A" multiline style={s.input} />
              <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
                <Pressable onPress={() => newPost.trim() && Alert.alert("Beitrag erstellen", "Beitrag-Funktion wird in Kuerze verfuegbar sein.")} style={({ pressed }) => [s.postBtn, pressed && { opacity: 0.7 }]}>
                  <Text style={s.postBtnText}>Posten</Text>
                </Pressable>
                <Pressable style={({ pressed }) => [s.photoBtn, pressed && { opacity: 0.6 }]}>
                  <IconSymbol name="photo.fill" size={18} color="#6B6B6B" />
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        {/* Feed */}
        {posts.map((post) => (
          <View key={post.id} style={[s.card, { marginTop: 8 }]}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <View style={s.avatar}><Text style={{ fontSize: 14, fontWeight: "300", color: "#D4A843" }}>{post.userName.charAt(0)}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={s.userName}>{post.userName}</Text>
                <Text style={s.postMeta}>{post.petName} · {post.timestamp}</Text>
              </View>
            </View>
            <Text style={s.postContent}>{post.content}</Text>
            {post.image && (
              <View style={{ overflow: "hidden", marginTop: 12 }}>
                <Image source={{ uri: post.image }} style={{ width: "100%", height: 200 }} resizeMode="cover" />
              </View>
            )}
            <View style={s.actions}>
              <Pressable onPress={() => toggleLike(post.id)} style={({ pressed }) => [s.actionBtn, pressed && { opacity: 0.6 }]}>
                <IconSymbol name={post.isLiked ? "heart.fill" : "heart"} size={18} color={post.isLiked ? "#EF5350" : "#4A4A4A"} />
                <Text style={[s.actionText, post.isLiked && { color: "#EF5350" }]}>{post.likes}</Text>
              </Pressable>
              <Pressable onPress={() => Alert.alert("Kommentieren", "Kommentar-Funktion wird in Kuerze verfuegbar.")} style={({ pressed }) => [s.actionBtn, pressed && { opacity: 0.6 }]}>
                <IconSymbol name="bubble.left.fill" size={18} color="#4A4A4A" />
                <Text style={s.actionText}>{post.comments}</Text>
              </Pressable>
              <Pressable style={({ pressed }) => [s.actionBtn, pressed && { opacity: 0.6 }]}>
                <IconSymbol name="square.and.arrow.up.fill" size={18} color="#4A4A4A" />
              </Pressable>
            </View>
          </View>
        ))}

        <View style={s.disclaimer}>
          <IconSymbol name="info.circle.fill" size={16} color="#D4A843" />
          <Text style={s.disclaimerText}>Die Community-Features sind Beispiele. In der finalen Version kannst du echte Beitraege erstellen.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  backBtn: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 },
  backText: { fontSize: 14, fontWeight: "500", color: "#D4A843", letterSpacing: 0.5 },
  header: { marginBottom: 32 },
  headerTitle: { fontSize: 28, fontWeight: "300", color: "#FAFAF8", letterSpacing: 2 },
  headerSub: { fontSize: 12, fontWeight: "400", color: "#6B6B6B", letterSpacing: 1, marginTop: 4 },
  goldDivider: { width: 40, height: 1, backgroundColor: "#D4A843", marginTop: 16 },
  card: { backgroundColor: "#141418", padding: 16, borderWidth: 1, borderColor: "rgba(212,168,67,0.08)" },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(212,168,67,0.1)", borderWidth: 1, borderColor: "rgba(212,168,67,0.2)", alignItems: "center", justifyContent: "center" },
  input: { minHeight: 50, fontSize: 14, color: "#FAFAF8", letterSpacing: 0.3 },
  postBtn: { flex: 1, backgroundColor: "rgba(212,168,67,0.1)", borderWidth: 1, borderColor: "rgba(212,168,67,0.2)", paddingVertical: 10, alignItems: "center" },
  postBtnText: { fontSize: 13, fontWeight: "600", color: "#D4A843", letterSpacing: 1 },
  photoBtn: { width: 40, height: 40, backgroundColor: "#1A1A20", borderWidth: 1, borderColor: "rgba(212,168,67,0.08)", alignItems: "center", justifyContent: "center" },
  userName: { fontSize: 14, fontWeight: "500", color: "#FAFAF8", letterSpacing: 0.3 },
  postMeta: { fontSize: 11, fontWeight: "400", color: "#6B6B6B", marginTop: 2 },
  postContent: { fontSize: 14, fontWeight: "400", color: "#C8C8C0", lineHeight: 22 },
  actions: { flexDirection: "row", alignItems: "center", gap: 24, paddingTop: 14, marginTop: 14, borderTopWidth: 1, borderTopColor: "rgba(212,168,67,0.05)" },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  actionText: { fontSize: 12, fontWeight: "500", color: "#4A4A4A" },
  disclaimer: { flexDirection: "row", gap: 10, marginTop: 24, backgroundColor: "rgba(212,168,67,0.05)", padding: 16, borderWidth: 1, borderColor: "rgba(212,168,67,0.1)" },
  disclaimerText: { flex: 1, fontSize: 12, fontWeight: "400", color: "#6B6B6B", lineHeight: 18 },
});
