import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, StyleSheet, Text, Linking, View, RefreshControl, Platform } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { ThemedView } from "@/components/themed/ThemedView";
import ThemedText from "@/components/themed/ThemedText";
import Card from "./Card";
import LoadingIndicator from "@/components/LoadingIndicator";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const TermsAndConditions = () => {
    const { theme } = useTheme();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    // simulate loading 
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    //Refresh Handler
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    }, []);

    if (loading) {
        return (
            <View style={[styles.fullScreenLoader, { backgroundColor: theme.colors.background }]}>
                <LoadingIndicator size={60} color={theme.colors.brandColor} />
            </View>
        );
    }
    return (
        <ThemedView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={theme.colors.brandColor}
                    />
                }
            >
                <Card>
                    {/* Entire Terms & Conditions Text */}
                    <ThemedText style={[styles.heading, { color: theme.colors.brandColor }]}>
                        <MaterialCommunityIcons
                            name="file-document"
                            size={22}
                            color={theme.colors.brandColor}
                        />{" "}
                        Terms and Conditions
                    </ThemedText>

                    <ThemedText style={[styles.text, { color: theme.colors.text }]}>
                        Last updated: November 17, 2025
                    </ThemedText>

                    <ThemedText style={[styles.text, { color: theme.colors.text }]}>
                        Please read these terms and conditions carefully before using Our Service.
                    </ThemedText>
                </Card>

                <Card style={{ flexShrink: 1, overflow: 'visible' }} >
                    <ThemedText style={[styles.subheading, { color: theme.colors.brandColor, fontSize: 16 }]}>
                        <MaterialCommunityIcons
                            name="book-open"
                            size={20}
                            color={theme.colors.brandColor}
                        />{" "}
                        Interpretation and Definitions
                    </ThemedText>

                    <ThemedText style={styles.textHeading}>
                        Interpretation
                    </ThemedText>

                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify" }]}>
                        The words of which the initial letter is capitalized have meanings defined under the following conditions.
                        The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
                    </ThemedText>
                </Card>

                <Card>
                    <ThemedText style={styles.textHeading}>Definitions</ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        Affiliate means an entity that controls, is controlled by or is under common control with a party, where
                        &quot;control&quot;  means ownership of 50% or more of the shares, equity interest or other securities entitled to vote
                        for election of directors or other managing authority.
                    </ThemedText>

                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        Country refers to: Nepal
                    </ThemedText>

                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        Company (referred to as either &ldquo;the Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in this Agreement)
                        refers to Can International, Muni Bhairab Marg, Kathmandu 44600
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        Device means any device that can access the Service such as a computer, a cellphone or a digital tablet.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify" }]}>
                        Service refers to the Website.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify" }]}>
                        Terms and Conditions (also referred as &quot;Terms&quot;) mean these Terms and Conditions that form the entire agreement between
                        You and the Company regarding the use of the Service. This Terms and Conditions agreement has been created with the help of the
                        Terms and Conditions Generator.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify" }]}>
                        Third-party Social Media Servicemeans any services or content (including data, information, products or services) provided by a third-party
                        that may be displayed, included or made available by the Service.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        <Text>
                            Website refers to Can International, accessible from{' '}
                            <Text
                                style={{ color: 'blue', textDecorationLine: 'underline' }}
                                onPress={() => Linking.openURL('https://transport.thecanbrand.com')}
                            >
                                https://transport.thecanbrand.com
                            </Text>
                        </Text>
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify" }]}>
                        You means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual
                        is accessing or using the Service, as applicable.{'\n'}
                    </ThemedText>
                </Card>
                <Card>
                    <ThemedText style={[styles.subheading, { color: theme.colors.brandColor }]}>
                        <MaterialCommunityIcons
                            name="check-circle"
                            size={20}
                            color={theme.colors.brandColor}
                        />{' '}
                        Acknowledgment
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify" }]}>
                        These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company.
                        These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service. Your access to and use
                        of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions
                        apply to all visitors, users and others who access or use the Service.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify" }]}>
                        By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree with any part of these Terms
                        and Conditions then You may not access the Service.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify" }]}>
                        You represent that you are over the age of 18. The Company does not permit those under 18 to use the Service.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify" }]}>
                        Your access to and use of the Service is also conditioned on Your acceptance of and compliance with the Privacy Policy of the Company.
                        Our Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your personal information when You use
                        the Application or the Website and tells You about Your privacy rights and how the law protects You. Please read Our Privacy Policy carefully
                        before using Our Service.
                    </ThemedText>
                </Card>

                <Card>
                    <ThemedText style={[styles.subheading, { color: theme.colors.brandColor }]}>
                        <MaterialCommunityIcons
                            name="open-in-new"
                            size={16}
                            color={theme.colors.brandColor}
                        />{" "}
                        Links to Other Websites
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text }]}>
                        Our Service may contain links to third-party web sites or services that are not owned or controlled by the Company.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify" }]}>
                        The Company has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party
                        web sites or services. You further acknowledge and agree that the Company shall not be responsible or liable, directly or indirectly,
                        for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods or services
                        available on or through any such web sites or services.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify" }]}>
                        We strongly advise You to read the terms and conditions and privacy policies of any third-party web sites or services that You visit.
                    </ThemedText>
                </Card>

                <Card>
                    <ThemedText style={[styles.subheading, { color: theme.colors.brandColor }]}>
                        <MaterialCommunityIcons
                            name="close-circle"
                            size={20}
                            color={theme.colors.brandColor}
                        />{" "}
                        Termination
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify" }]}>
                        We may terminate or suspend Your access immediately, without prior notice or liability, for any reason whatsoever, including without
                        limitation if You breach these Terms and Conditions.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify" }]}>
                        Upon termination, Your right to use the Service will cease immediately.
                    </ThemedText>
                </Card>

                <Card>
                    <ThemedText style={[styles.subheading, { color: theme.colors.brandColor }]}>
                        <MaterialCommunityIcons
                            name="alert-circle"
                            size={20}
                            color={theme.colors.brandColor}
                        />{" "}
                        Limitation of Liability
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify" }]}>
                        Notwithstanding any damages that You might incur, the entire liability of the Company and any of its suppliers under any provision of
                        this Terms and Your exclusive remedy for all of the foregoing shall be limited to the amount actually paid by You through the Service or
                        100 USD if You haven&apos;t purchased anything through the Service.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", letterSpacing: -0.5 }]}>
                        To the maximum extent permitted by applicable law, in no event shall the Company or its suppliers be liable for any special, incidental,
                        indirect, or consequential damages whatsoever (including, but not limited to, damages for loss of profits, loss of data or other information,
                        for business interruption, for personal injury, loss of privacy arising out of or in any way related to the use of or inability to use the Service,
                        third-party software and/or third-party hardware used with the Service, or otherwise in connection with any provision of this Terms), even
                        if the Company or any supplier has been advised of the possibility of such damages and even if the remedy fails of its essential purpose.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify" }]}>
                        Some states do not allow the exclusion of implied warranties or limitation of liability for incidental or consequential damages, which means
                        that some of the above limitations may not apply. In these states, each party&apos;s liability will be limited to the greatest extent
                        permitted by law.
                    </ThemedText>
                </Card>

                <Card>
                    <ThemedText style={[styles.subheading, { color: theme.colors.brandColor }]}>
                        <MaterialCommunityIcons
                            name="shield-alert"
                            size={20}
                            color={theme.colors.brandColor}
                        />{" "}
                        &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; Disclaimer
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify" }]}>
                        The Service is provided to You &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; and with all faults and defects without warranty of any kind.
                        To the maximum extent permitted under applicable law, the Company, on its own behalf and on behalf of its Affiliates and its and their
                        respective licensors and service providers, expressly disclaims all warranties, whether express, implied, statutory or otherwise,
                        with respect to the Service, including all implied warranties of merchantability, fitness for a particular purpose, title and non-infringement,
                        and warranties that may arise out of course of dealing, course of performance, usage or trade practice. Without limitation to the foregoing,
                        the Company provides no warranty or undertaking, and makes no representation of any kind that the Service will meet Your requirements,
                        achieve any intended results, be compatible or work with any other software, applications, systems or services, operate without interruption,
                        meet any performance or reliability standards or be error free or that any errors or defects can or will be corrected.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify" }]}>
                        Without limiting the foregoing, neither the Company nor any of the company&apos;s provider makes any representation or warranty of any kind,
                        express or implied: (i) as to the operation or availability of the Service, or the information, content, and materials or products included thereon;
                        (ii) that the Service will be uninterrupted or error-free; (iii) as to the accuracy, reliability, or currency of any information or content provided
                        through the Service; or (iv) that the Service, its servers, the content, or e-mails sent from or on behalf of the Company are free of viruses, scripts,
                        trojan horses, worms, malware, timebombs or other harmful components.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify" }]}>
                        Some jurisdictions do not allow the exclusion of certain types of warranties or limitations on applicable statutory rights of a consumer,
                        so some or all of the above exclusions and limitations may not apply to You. But in such a case the exclusions and limitations set forth in
                        this section shall be applied to the greatest extent enforceable under applicable law.
                    </ThemedText>
                </Card>

                <Card>
                    <ThemedText style={[styles.subheading, { color: theme.colors.brandColor }]}>
                        <MaterialCommunityIcons
                            name="gavel"
                            size={20}
                            color={theme.colors.brandColor}
                        />{" "}
                        Governing Law
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify" }]}>
                        The laws of the Country, excluding its conflicts of law rules, shall govern this Terms and Your use of the Service.
                        Your use of the Application may also be subject to other local, state, national, or international laws.
                    </ThemedText>
                </Card>

                <Card>
                    <ThemedText style={[styles.subheading, { color: theme.colors.brandColor }]}>
                        <MaterialCommunityIcons
                            name="handshake"
                            size={20}
                            color={theme.colors.brandColor}
                        />{" "}
                        Disputes Resolution
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify" }]}>
                        If You have any concern or dispute about the Service, You agree to first try to resolve the dispute informally by contacting the Company.
                    </ThemedText>
                </Card>

                <Card>
                    <ThemedText style={[styles.subheading, { color: theme.colors.brandColor }]}>
                        <MaterialCommunityIcons
                            name="flag"
                            size={20}
                            color={theme.colors.brandColor}
                        />{" "}
                        For European Union (EU) Users
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify" }]}>
                        If You are a European Union consumer, you will benefit from any mandatory provisions of the law of the country in which You are resident.
                    </ThemedText>
                </Card>

                <Card>
                    <ThemedText style={[styles.subheading, { color: theme.colors.brandColor }]}>
                        <MaterialCommunityIcons
                            name="account-tie"
                            size={20}
                            color={theme.colors.brandColor}
                        />{" "}

                        United States Legal Compliance
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify" }]}>
                        You represent and warrant that (i) You are not located in a country that is subject to the United States government embargo,
                        or that has been designated by the United States government as a &quot;terrorist supporting&quot; country, and (ii) You are
                        not listed on any United States government list of prohibited or restricted parties.
                    </ThemedText>
                </Card>

                <Card>
                    <ThemedText style={[styles.subheading, { color: theme.colors.brandColor }]}>
                        <MaterialCommunityIcons
                            name="file-check"
                            size={20}
                            color={theme.colors.brandColor}
                        />{" "}
                        Severability and Waiver
                    </ThemedText>
                    <ThemedText style={styles.textHeading}>Severability</ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify" }]}>
                        If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted
                        to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions
                        will continue in full force and effect.
                    </ThemedText>
                </Card>
                <Card>
                    <ThemedText style={styles.textHeading}>Waiver</ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify" }]}>
                        Except as provided herein, the failure to exercise a right or to require performance of an obligation under these Terms
                        shall not affect a party&apos;s ability to exercise such right or require such performance at any time thereafter nor shall the waiver of a
                        breach constitute a waiver of any subsequent breach.
                    </ThemedText>
                </Card>
                <Card>
                    <ThemedText style={styles.textHeading}>Translation Interpretation</ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify" }]}>
                        These Terms and Conditions may have been translated if We have made them available to You on our Service. You agree that
                        the original English text shall prevail in the case of a dispute.
                    </ThemedText>
                </Card>
                <Card>

                    <ThemedText style={styles.textHeading}>Changes to These Terms and Conditions</ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify" }]}>
                        We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material
                        We will make reasonable efforts to provide at least 30 days&apos; notice prior to any new terms taking effect. What constitutes
                        a material change will be determined at Our sole discretion.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify" }]}>
                        By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms.
                        If You do not agree to the new terms, in whole or in part, please stop using the website and the Service.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify" }]}>
                        By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms.
                        If You do not agree to the new terms, in whole or in part, please stop using the website and the Service.
                    </ThemedText>
                </Card>
                <Card>
                    <ThemedText style={styles.textHeading}>
                        <MaterialCommunityIcons
                            name="phone"
                            size={16}
                            color={theme.colors.text}
                        />{" "}Contact Us</ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify" }]}>
                        If you have any questions about these Terms and Conditions, You can contact us:
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text }]}>
                        By email: support@international.nepalcan.com
                        {"\n"}
                        By phone number: 01-5970736
                    </ThemedText>
                </Card>
            </ScrollView>
        </ThemedView >
    );
};

export default TermsAndConditions;

const styles = StyleSheet.create({
    scrollContent: {
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    fullScreenLoader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    heading: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 10,
        fontFamily: "Montserrat-Bold",
        textAlign: "left",
    },
    subheading: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 16,
        marginBottom: 8,
        fontFamily: "Montserrat-Medium",
        textAlign: "left",
    },
    textHeading: {
        fontSize: 14,
        fontWeight: "600",
        marginTop: 12,
        marginBottom: 6,
        fontFamily: "Montserrat-Medium",
    },
    text: {
        fontSize: 13,
        lineHeight: 20,
        marginBottom: 8,
        ...Platform.select({
            ios: {
                letterSpacing: -0.5,
            },
            android: {
                letterSpacing: 0,
                includeFontPadding: false,
            },
        }),
    },
});




