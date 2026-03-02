import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  FlatList,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";

interface Friend {
  id: string;
  name: string;
  petName: string;
  status: "online" | "offline";
  avatar: string;
}

interface Post {
  id: string;
  author: string;
  petName: string;
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
  liked: boolean;
  avatar?: string;
}

export default function CommunitySocialScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<"feed" | "friends">("feed");
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: "Anna",
      petName: "Max",
      content: "Max hat heute seinen ersten Schwimmkurs gemacht! 🏊",
      likes: 24,
      comments: 5,
      timestamp: "vor 2h",
      liked: false,
    },
    {
      id: "2",
      author: "Peter",
      petName: "Luna",
      content: "Unser neuer Lieblingsspielplatz im Park!",
      likes: 18,
      comments: 3,
      timestamp: "vor 4h",
      liked: false,
    },
    {
      id: "3",
      author: "Sarah",
      petName: "Bella",
      content: "Bella hat heute ihre Prüfung bestanden!",
      likes: 42,
      comments: 8,
      timestamp: "vor 6h",
      liked: false,
    },
  ]);

  const [friends] = useState<Friend[]>([
    { id: "1", name: "Anna", petName: "Max", status: "online", avatar: "👤" },
    { id: "2", name: "Peter", petName: "Luna", status: "online", avatar: "👤" },
    { id: "3", name: "Sarah", petName: "Bella", status: "offline", avatar: "👤" },
    { id: "4", name: "Tom", petName: "Rocky", status: "online", avatar: "👤" },
  ]);

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View className="bg-white/10 rounded-2xl p-4 border border-white/20 mb-3">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
            <Text className="text-lg">{item.avatar}</Text>
          </View>
          <View>
            <Text className="text-white font-semibold">{item.author}</Text>
            <Text className="text-white/60 text-xs">{item.petName}</Text>
          </View>
        </View>
        <Text className="text-white/60 text-xs">{item.timestamp}</Text>
      </View>

      <Text className="text-white/90 text-sm mb-4 leading-relaxed">
        {item.content}
      </Text>

      <View className="flex-row items-center justify-between pt-3 border-t border-white/10">
        <Pressable
          onPress={() => handleLike(item.id)}
          className="flex-row items-center gap-2"
        >
          <IconSymbol
            size={18}
            name={item.liked ? "heart.fill" : "heart"}
            color={item.liked ? "#FF6B6B" : "#FFFFFF"}
          />
          <Text className="text-white/70 text-xs">{item.likes}</Text>
        </Pressable>

        <Pressable className="flex-row items-center gap-2">
          <IconSymbol size={18} name="bubble.right" color="#FFFFFF" />
          <Text className="text-white/70 text-xs">{item.comments}</Text>
        </Pressable>

        <Pressable className="flex-row items-center gap-2">
          <IconSymbol size={18} name="square.and.arrow.up" color="#FFFFFF" />
          <Text className="text-white/70 text-xs">Teilen</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderFriend = ({ item }: { item: Friend }) => (
    <Pressable className="bg-white/10 rounded-2xl p-4 border border-white/20 mb-3 flex-row items-center justify-between">
      <View className="flex-row items-center gap-3">
        <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center relative">
          <Text className="text-2xl">{item.avatar}</Text>
          <View
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-blue-600 ${
              item.status === "online" ? "bg-green-500" : "bg-gray-500"
            }`}
          />
        </View>
        <View>
          <Text className="text-white font-semibold">{item.name}</Text>
          <Text className="text-white/60 text-xs">{item.petName}</Text>
        </View>
      </View>
      <Pressable className="w-8 h-8 bg-white/20 rounded-full items-center justify-center">
        <IconSymbol size={16} name="message.fill" color="#FFFFFF" />
      </Pressable>
    </Pressable>
  );

  return (
    <LinearGradient
      colors={["#3498DB", "#2980B9"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 100,
          paddingHorizontal: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8">
          <View>
            <Text className="text-white text-sm font-medium opacity-80">
              Soziales Netzwerk
            </Text>
            <Text className="text-white text-2xl font-bold">Community</Text>
          </View>
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
          >
            <IconSymbol size={20} name="xmark" color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Tab Navigation */}
        <View className="flex-row gap-3 mb-6">
          <Pressable
            onPress={() => setActiveTab("feed")}
            className={`flex-1 py-3 rounded-lg ${
              activeTab === "feed" ? "bg-white" : "bg-white/20"
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === "feed" ? "text-blue-600" : "text-white"
              }`}
            >
              Feed
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("friends")}
            className={`flex-1 py-3 rounded-lg ${
              activeTab === "friends" ? "bg-white" : "bg-white/20"
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === "friends" ? "text-blue-600" : "text-white"
              }`}
            >
              Freunde
            </Text>
          </Pressable>
        </View>

        {/* Feed Tab */}
        {activeTab === "feed" && (
          <>
            {/* Create Post Button */}
            <Pressable className="mb-6 rounded-2xl overflow-hidden">
              <LinearGradient
                colors={["rgba(255,255,255,0.15)", "rgba(255,255,255,0.05)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View className="p-4 flex-row items-center gap-3">
                  <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
                    <Text className="text-lg">👤</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-white/60 text-sm">
                      Was ist los mit deinem Tier?
                    </Text>
                  </View>
                  <IconSymbol size={20} name="camera.fill" color="#FFFFFF" />
                </View>
              </LinearGradient>
            </Pressable>

            {/* Posts */}
            <FlatList
              data={posts}
              renderItem={renderPost}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </>
        )}

        {/* Friends Tab */}
        {activeTab === "friends" && (
          <>
            {/* Add Friend Button */}
            <Pressable className="py-4 rounded-2xl items-center justify-center mb-6">
              <LinearGradient
                colors={["rgba(255,255,255,0.3)", "rgba(255,255,255,0.1)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: "100%",
                  paddingVertical: 16,
                  borderRadius: 16,
                  alignItems: "center",
                }}
              >
                <View className="flex-row items-center gap-2">
                  <IconSymbol size={20} name="person.badge.plus" color="#FFFFFF" />
                  <Text className="text-white font-bold text-lg">
                    Freund hinzufügen
                  </Text>
                </View>
              </LinearGradient>
            </Pressable>

            {/* Friends List */}
            <View className="mb-6">
              <Text className="text-white font-semibold mb-3">
                Online ({friends.filter((f) => f.status === "online").length})
              </Text>
              <FlatList
                data={friends.filter((f) => f.status === "online")}
                renderItem={renderFriend}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>

            <View>
              <Text className="text-white font-semibold mb-3">
                Offline ({friends.filter((f) => f.status === "offline").length})
              </Text>
              <FlatList
                data={friends.filter((f) => f.status === "offline")}
                renderItem={renderFriend}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>
          </>
        )}

        {/* Liability Disclaimer */}
        <View className="bg-white/5 rounded-2xl p-4 border border-white/10 mt-6">
          <Text className="text-white/60 text-xs leading-relaxed">
            <Text className="font-semibold">Datenschutz:</Text> Ihre Daten und
            die Ihrer Haustiere werden gemäß DSGVO geschützt. Teilen Sie nur
            mit vertrauenswürdigen Freunden.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
