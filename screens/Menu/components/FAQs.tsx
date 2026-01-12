import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity, RefreshControl } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import ThemedText from "@/components/themed/ThemedText";
import { useTheme } from "@/theme/ThemeProvider";
import LoadingIndicator from "@/components/LoadingIndicator";

const FAQs = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How can I track my shipment?",
      answer: "You can track your shipment in real time using the 'Track My Order' button in the navigation bar.",
    },
    {
      question: "What areas do you provide logistics services in?",
      answer: "We provide logistics services nationwide and also offer international shipping solutions.",
    },
    {
      question: "How do I get a price quote?",
      answer: "You can request a free quote by filling out the contact form or reaching out to our support team.",
    },
  ];

  //Refresh Handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  // simulate loading 
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <View style={[styles.fullScreenLoader, { backgroundColor: theme.colors.background }]}>
        <LoadingIndicator size={60} color={theme.colors.brandColor} />
      </View>
    );
  }

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.dark ? "#fff" : "#000"}
          style={{ backgroundColor: theme.colors.background }}
        />}
    >
      {/* Header */}
      <View style={styles.sectionHeader}>
        <ThemedText style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Frequently Asked Questions
        </ThemedText>
        <ThemedText style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
          Find answers to common queries about our services
        </ThemedText>
      </View>

      {/* FAQ Cards */}
      <View style={styles.faqContainer}>
        {faqs.map((faq, index) => (
          <View
            key={index}
            style={[
              styles.faqCard,
              { backgroundColor: theme.colors.card, borderColor: theme.colors.border + "30" },
            ]}
          >
            <TouchableOpacity
              style={styles.questionRow}
              onPress={() => toggleFAQ(index)}
              activeOpacity={0.7}
            >
              <View style={styles.questionLeft}>
                <MaterialIcons name="help-outline" size={20} color={theme.colors.brandColor} />
                <ThemedText style={[styles.question, { color: theme.colors.text }]}>
                  {faq.question}
                </ThemedText>
              </View>

              {/* Dropdown arrow */}
              <MaterialIcons
                name={activeIndex === index ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                size={24}
                color={theme.colors.brandColor}
              />
            </TouchableOpacity>

            {/* Answer */}
            {activeIndex === index && (
              <ThemedText style={[styles.answer, { color: theme.colors.textSecondary }]}>
                {faq.answer}
              </ThemedText>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullScreenLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 12,
  },
  sectionHeader: {
    marginBottom: 12,
    marginHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: "400",
    opacity: 0.8,
    marginTop: 4,
  },
  faqContainer: {
    gap: 10,
  },
  faqCard: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  questionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  questionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  question: {
    fontSize: 14,
    marginLeft: 6,
    flexShrink: 1,
  },
  answer: {
    fontSize: 13,
    marginTop: 8,
    lineHeight: 20,
  },
});

export default FAQs;
