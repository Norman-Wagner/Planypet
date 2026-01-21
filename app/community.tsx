import { ScrollView, Text, View, Pressable, TextInput, Image, Alert } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { GlassCard } from "@/components/ui/glass-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface Post {
  id: string;
  userName: string;
  userAvatar: string;
  petName: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  isLiked: boolean;
}

const MOCK_POSTS: Post[] = [
  {
    id: "1",
    userName: "Maria Schmidt",
    userAvatar: "👩",
    petName: "Luna",
    content: "Erster Spaziergang nach dem Regen! Luna liebt Pfützen 🐾",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400",
    likes: 24,
    comments: 5,
    timestamp: "vor 2 Stunden",
    isLiked: false,
  },
  {
    id: "2",
    userName: "Thomas Müller",
    userAvatar: "👨",
    petName: "Max",
    content: "Max hat heute seinen ersten Geburtstag gefeiert! 🎉",
    likes: 42,
    comments: 12,
    timestamp: "vor 5 Stunden",
    isLiked: true,
  },
  {
    id: "3",
    userName: "Anna Weber",
    userAvatar: "👩‍🦰",
    petName: "Mimi",
    content: "Kann jemand einen guten Tierarzt in Berlin empfehlen?",
    likes: 8,
    comments: 15,
    timestamp: "vor 1 Tag",
    isLiked: false,
  },
];

export default function CommunityScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [newPost, setNewPost] = useState("");

  const toggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleComment = (postId: string) => {
    Alert.alert("Kommentieren", "Kommentar-Funktion wird in Kürze verfügbar sein.");
  };

  const handleShare = (postId: string) => {
    Alert.alert("Teilen", "Teilen-Funktion wird in Kürze verfügbar sein.");
  };

  const handleCreatePost = () => {
    if (newPost.trim()) {
      Alert.alert("Beitrag erstellen", "Beitrag-Funktion wird in Kürze verfügbar sein.");
      setNewPost("");
    }
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <Pressable
            onPress={() => router.back()}
            className="mr-4"
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <IconSymbol name="chevron.left" size={28} color={colors.primary} />
          </Pressable>
          <Text className="text-3xl font-bold text-foreground">Community</Text>
        </View>

        {/* Create Post */}
        <GlassCard className="mb-6">
          <View className="flex-row items-start">
            <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center mr-3">
              <Text className="text-xl">👤</Text>
            </View>
            <View className="flex-1">
              <TextInput
                value={newPost}
                onChangeText={setNewPost}
                placeholder="Was möchtest du teilen?"
                placeholderTextColor={colors.muted}
                multiline
                className="text-foreground mb-3"
                style={{ minHeight: 60 }}
              />
              <View className="flex-row gap-2">
                <Pressable
                  onPress={handleCreatePost}
                  style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
                  className="flex-1"
                >
                  <View className="bg-primary px-4 py-2 rounded-full items-center">
                    <Text className="text-white font-medium text-sm">Posten</Text>
                  </View>
                </Pressable>
                <Pressable
                  style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                  className="w-10 h-10 bg-surface rounded-full items-center justify-center"
                >
                  <IconSymbol name="photo.fill" size={20} color={colors.muted} />
                </Pressable>
              </View>
            </View>
          </View>
        </GlassCard>

        {/* Feed */}
        <View className="gap-4">
          {posts.map((post) => (
            <GlassCard key={post.id} className="p-4">
              {/* Post Header */}
              <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center mr-3">
                  <Text className="text-xl">{post.userAvatar}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-foreground font-semibold">{post.userName}</Text>
                  <Text className="text-muted text-xs">
                    {post.petName} • {post.timestamp}
                  </Text>
                </View>
                <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
                  <IconSymbol name="ellipsis.circle.fill" size={24} color={colors.muted} />
                </Pressable>
              </View>

              {/* Post Content */}
              <Text className="text-foreground mb-3">{post.content}</Text>

              {/* Post Image */}
              {post.image && (
                <View className="rounded-xl overflow-hidden mb-3">
                  <Image
                    source={{ uri: post.image }}
                    style={{ width: "100%", height: 200 }}
                    resizeMode="cover"
                  />
                </View>
              )}

              {/* Post Actions */}
              <View className="flex-row items-center justify-between pt-3 border-t border-border">
                <Pressable
                  onPress={() => toggleLike(post.id)}
                  style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                  className="flex-row items-center gap-2"
                >
                  <IconSymbol
                    name={post.isLiked ? "heart.fill" : "heart"}
                    size={20}
                    color={post.isLiked ? colors.error : colors.muted}
                  />
                  <Text className={post.isLiked ? "text-error" : "text-muted"}>
                    {post.likes}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => handleComment(post.id)}
                  style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                  className="flex-row items-center gap-2"
                >
                  <IconSymbol name="bubble.left.fill" size={20} color={colors.muted} />
                  <Text className="text-muted">{post.comments}</Text>
                </Pressable>

                <Pressable
                  onPress={() => handleShare(post.id)}
                  style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                >
                  <IconSymbol name="square.and.arrow.up.fill" size={20} color={colors.muted} />
                </Pressable>
              </View>
            </GlassCard>
          ))}
        </View>

        {/* Info */}
        <GlassCard className="mt-6 border-warning/30">
          <View className="flex-row items-start">
            <IconSymbol name="info.circle.fill" size={20} color={colors.warning} />
            <View className="flex-1 ml-3">
              <Text className="text-foreground font-medium text-sm">Hinweis</Text>
              <Text className="text-muted text-xs mt-1">
                Die Community-Features sind Beispiele. In der finalen Version kannst du echte Beiträge erstellen und mit anderen Tierbesitzern interagieren.
              </Text>
            </View>
          </View>
        </GlassCard>
      </ScrollView>
    </ScreenContainer>
  );
}
