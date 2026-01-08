import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, StyleSheet, Text, Linking, View, RefreshControl, Platform } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { ThemedView } from "@/components/themed/ThemedView";
import ThemedText from "@/components/themed/ThemedText";
import Card from "./Card";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import LoadingIndicator from "@/components/LoadingIndicator";

const PrivacyPolicy = () => {
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
                    {/* Entire Privacy Policy Text */}
                    <ThemedText style={[styles.heading, { color: theme.colors.brandColor }]}>
                        <MaterialCommunityIcons
                            name="shield-lock"
                            size={20}
                            color={theme.colors.brandColor}
                        />{" "}
                        Privacy Policy
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        Last updated: November 17, 2025
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        This Privacy Policy describes our policies and procedures on the collection, use and disclosure
                        of your information when you use the service and tells you about your privacy rights and how the law protects you.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        We use your personal data to provide and improve the service. By using the service, you agree to the collection
                        and use of information in accordance with this Privacy Policy.
                    </ThemedText>
                </Card>
                <Card>
                    <ThemedText style={[styles.subheading, { color: theme.colors.brandColor, fontSize: 16 }]}>
                        <MaterialCommunityIcons
                            name="book-open"
                            size={20}
                            color={theme.colors.brandColor}
                        />{" "}
                        Interpretation and Definitions
                    </ThemedText>
                    <ThemedText style={styles.textHeading}>Interpretation</ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        The words of which the initial letter is capitalized have meanings defined under the following conditions.
                        The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
                    </ThemedText>
                </Card>
                <Card>
                    <ThemedText style={styles.textHeading}>Definitions</ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        For the purposes of this Privacy Policy:
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        Account means a unique account created for you to access our service or parts of our service.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        Affiliate means an entity that controls, is controlled by or is under common control with a party,
                        where &quot;control&quot; means ownership of 50% or more of the shares, equity interest or other securities
                        entitled to vote for election of directors or other managing authority.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        Company (referred to as either &quot;the Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot;
                        in this Agreement) refers to Can International, Muni Bhairab Marg, Kathmandu 44600
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        Cookies are small files that are placed on your computer, mobile device or any other device by a website,
                        containing the details of your browsing history on that website among its many uses.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        Country refers to: Nepal
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        Device means any device that can access the service such as a computer, a cellphone or a digital tablet.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        Personal Data is any information that relates to an identified or identifiable individual.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        service means any device that can access the service such as a computer, a cellphone or a digital tablet.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        service Provider means any natural or legal person who processes the data on behalf of the company. It refers to
                        third-party companies or individuals employed by the company to facilitate the service, to provide the service on
                        behalf of the company, to perform services related to the service or to assist the company in analyzing how the service is used.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        Third-party Social Media service refers to any website or any social network website through which a User can log in or create
                        an account to use the service.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        Usage Data refers to data collected automatically, either generated by the use of the service or from the service
                        infrastructure itself (for example, the duration of a page visit).
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
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        You means the individual accessing or using the service, or the company, or other legal entity on behalf of which such individual
                        is accessing or using the service, as applicable.
                    </ThemedText>
                </Card>
                <Card>
                    <ThemedText style={[styles.subheading, { color: theme.colors.brandColor, fontSize: 16 }]}>
                        <MaterialCommunityIcons
                            name="shield-account"
                            size={20}
                            color={theme.colors.brandColor}
                        />{" "}
                        Collecting and Using your Personal Data
                    </ThemedText>
                    <ThemedText style={[styles.subheading, { color: theme.colors.brandColor }]}>
                        Types of Data Collected
                    </ThemedText>
                    <ThemedText style={styles.textHeading}>Personal data</ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        While using our service, We may ask you to provide us with certain personally identifiable information that can be used to contact or
                        identify you. Personally identifiable information may include, but is not limited to:
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        <Text><Entypo name="dot-single" size={16} color={theme.colors.brandColor} />
                            Email address{'\n'}
                        </Text>
                        <Text><Entypo name="dot-single" size={16} color={theme.colors.brandColor} />
                            First name and last name{'\n'}
                        </Text>
                        <Text><Entypo name="dot-single" size={16} color={theme.colors.brandColor} />
                            Phone number{'\n'}
                        </Text>
                        <Text>
                            <Entypo name="dot-single" size={16} color={theme.colors.brandColor} />
                            Address, State, Province, ZIP/Postal code, City{'\n'}
                        </Text>
                    </ThemedText>
                </Card>
                <Card>
                    <ThemedText style={styles.textHeading}>Usage Data</ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        Usage Data is collected automatically when using the service.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        Usage Data may include information such as your device&apos;s Internet Protocol address (e.g. IP address),
                        browser type, browser version, the pages of our service that you visit, the time and date of your visit, the
                        time spent on those pages, unique device identifiers and other diagnostic data.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        When you access the service by or through a mobile device, We may collect certain information automatically,
                        including, but not limited to, the type of mobile device you use, your mobile device unique ID, the IP address
                        of your mobile device, your mobile operating system, the type of mobile Internet browser you use, unique device
                        identifiers and other diagnostic data.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        We may also collect information that your browser sends whenever You visit our Service or when You access the Service
                        by or through a mobile device.{'\n'}
                    </ThemedText>
                </Card>
                <Card>
                    <ThemedText style={styles.textHeading}>Information from Third-Party Social Media Services</ThemedText>
                    <ThemedText style={styles.text}>
                        The Company allows You to create an account and log in to use the Service through the following Third-party Social
                        Media Services:
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        <Text><Entypo name="dot-single" size={16} color={theme.colors.brandColor} />
                            Google{'\n'}
                        </Text>
                        <Text><Entypo name="dot-single" size={16} color={theme.colors.brandColor} />
                            Instagram{'\n'}
                        </Text>
                        <Text><Entypo name="dot-single" size={16} color={theme.colors.brandColor} />
                            Phone number{'\n'}
                        </Text>
                        <Text><Entypo name="dot-single" size={16} color={theme.colors.brandColor} />
                            Linkedin{'\n'}
                        </Text>
                        <Text><Entypo name="dot-single" size={16} color={theme.colors.brandColor} />
                            Twitter
                        </Text>
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        If You decide to register through or otherwise grant us access to a Third-Party Social Media Service, We may
                        collect Personal data that is already associated with Your Third-Party Social Media Service&apos;s account,
                        such as Your name, Your email address, Your activities or Your contact list associated with that account.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        You may also have the option of sharing additional information with the Company through Your Third-Party Social Media
                        Service&apos;s account. If You choose to provide such information and Personal Data, during registration or otherwise,
                        You are giving the Company permission to use, share, and store it in a manner consistent with this Privacy Policy.
                    </ThemedText>
                </Card>

                <Card>
                    <ThemedText style={[styles.subheading, { color: theme.colors.brandColor }]}>
                        <MaterialCommunityIcons
                            name="cookie"
                            size={20}
                            color={theme.colors.brandColor}
                        />{" "}
                        Tracking Technologies and Cookies
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        We use Cookies and similar tracking technologies to track the activity on Our Service and store certain information.
                        Tracking technologies used are beacons, tags, and scripts to collect and track information and to improve and analyze Our Service.
                        The technologies We use may include:
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        <Text><Entypo name="dot-single" size={16} color={theme.colors.brandColor} />
                            Cookies or Browser Cookies: A cookie is a small file placed on Your Device. You can instruct Your browser to refuse all Cookies or
                            to indicate when a Cookie is being sent. However, if You do not accept Cookies, You may not be able to use some parts of our Service.
                            Unless you have adjusted Your browser setting so that it will refuse Cookies, our Service may use Cookies.
                        </Text>
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        <Text><Entypo name="dot-single" size={16} color={theme.colors.brandColor} />
                            Web Beacons: Certain sections of our Service and our emails may contain small electronic files known as web beacons
                            (also referred to as clear gifs, pixel tags, and single-pixel gifs) that permit the Company, for example, to count users
                            who have visited those pages or opened an email and for other related website statistics (for example, recording the popularity
                            of a certain section and verifying system and server integrity).
                        </Text>
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        Cookies can be &quot;Persistent&quot; or &quot;Session&quot; Cookies. Persistent Cookies remain on Your personal computer or
                        mobile device when You go offline, while Session Cookies are deleted as soon as You close Your web browser. Learn more about
                        cookies on the Free Privacy Policy website article.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        We use both Session and Persistent Cookies for the purposes set out below:{'\n'}
                    </ThemedText>
                </Card>
                <Card>
                    <ThemedText style={styles.textHeading}>Necessary / Essential Cookies</ThemedText>
                    <ThemedText style={styles.text}>
                        Type: Session Cookies
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        Administered by: Us
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        Purpose: These Cookies are essential to provide You with services available through the Website and to
                        enable You to use some of its features. They help to authenticate users and prevent fraudulent use of user accounts.
                        Without these Cookies, the services that You have asked for cannot be provided, and We only use these Cookies to provide
                        You with those services.{'\n'}
                    </ThemedText>
                </Card>
                <Card>
                    <ThemedText style={styles.textHeading}>Cookies Policy / Notice Acceptance Cookies</ThemedText>
                    <ThemedText style={styles.text}>
                        Type: Persistent Cookies
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        Administered by: Us
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        Purpose: These Cookies identify if users have accepted the use of cookies on the Website.
                    </ThemedText>
                </Card>
                <Card>
                    <ThemedText style={styles.textHeading}>Functionality Cookies</ThemedText>
                    <ThemedText style={styles.text}>
                        Type: Persistent Cookies
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        Administered by: Us
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        Purpose: These Cookies allow us to remember choices You make when You use the Website, such as
                        remembering your login details or language preference. The purpose of these Cookies is to provide
                        You with a more personal experience and to avoid You having to re-enter your preferences every time
                        You use the Website.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        For more information about the cookies we use and your choices regarding cookies, please visit our Cookies Policy
                        or the Cookies section of our Privacy Policy.{'\n'}
                    </ThemedText>
                </Card>
                <Card>
                    <ThemedText style={[styles.subheading, { color: theme.colors.brandColor }]}>
                        <MaterialCommunityIcons
                            name="account-arrow-right"
                            size={20}
                            color={theme.colors.brandColor}
                        />{" "}
                        Use of your Personal Data
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        The Company may use Personal Data for the following purposes:
                    </ThemedText>
                    <ThemedText style={styles.textHeading}>To provide and maintain our Service,</ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        including to monitor the usage of our Service.
                    </ThemedText>

                    <ThemedText style={styles.textHeading}>To manage Your Account:</ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        to manage Your registration as a user of the Service. The Personal Data You provide can give You access to
                        different functionalities of the Service that are available to You as a registered user.
                    </ThemedText>

                    <ThemedText style={styles.textHeading}>For the performance of a contract:</ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        the development, compliance and undertaking of the purchase contract for the products, items or
                        services You have purchased or of any other contract with Us through the Service.
                    </ThemedText>

                    <ThemedText style={styles.textHeading}>To contact You:</ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication, such as a
                        mobile application&apos;s push notifications regarding updates or informative communications related to the functionalities,
                        products or contracted services, including the security updates, when necessary or reasonable for their implementation.
                    </ThemedText>

                    <ThemedText style={styles.textHeading}>To provide You with news, special offers and general information</ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        about other goods, services and events which we offer that are similar to those that you have already purchased or enquired about
                        unless You have opted not to receive such information.
                    </ThemedText>

                    <ThemedText style={styles.textHeading}>To manage Your requests:</ThemedText>
                    <ThemedText style={styles.text}>To attend and manage Your requests to Us.</ThemedText>

                    <ThemedText style={styles.textHeading}>For business transfers:</ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        We may use Your information to evaluate or conduct a merger, divestiture, restructuring, reorganization, dissolution,
                        or other sale or transfer of some or all of Our assets, whether as a going concern or as part of bankruptcy, liquidation,
                        or similar proceeding, in which Personal Data held by Us about our Service users is among the assets transferred.
                    </ThemedText>

                    <ThemedText style={styles.textHeading}>For other purposes:</ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        We may use Your information for other purposes, such as data analysis, identifying usage trends, determining the effectiveness
                        of our promotional campaigns and to evaluate and improve our Service, products, services, marketing and your experience.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        We may share Your personal information in the following situations:
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        <Text>
                            <Entypo name="dot-single" size={16} color={theme.colors.brandColor} />
                            With Service Providers: We may share Your personal information with Service Providers to monitor and analyze the
                            use of our Service, to contact You.
                        </Text>
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        <Text>
                            <Entypo name="dot-single" size={16} color={theme.colors.brandColor} />
                            For business transfers: We may share or transfer Your personal information in connection with, or during negotiations
                            of, any merger, sale of Company assets, financing, or acquisition of all or a portion of Our business to another company.
                        </Text>
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        <Text>
                            <Entypo name="dot-single" size={16} color={theme.colors.brandColor} />
                            With Affiliates: We may share Your information with Our affiliates, in which case we will require those affiliates to honor
                            this Privacy Policy. Affiliates include Our parent company and any other subsidiaries, joint venture partners or other companies
                            that We control or that are under common control with Us.
                        </Text>
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        <Text>
                            <Entypo name="dot-single" size={16} color={theme.colors.brandColor} />
                            With business partners: We may share Your information with Our business partners to offer You certain products, services or promotions.
                        </Text>
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        <Text>
                            <Entypo name="dot-single" size={16} color={theme.colors.brandColor} />
                            With other users: When You share personal information or otherwise interact in the public areas with other users,
                            such information may be viewed by all users and may be publicly distributed outside. If You interact with other users
                            or register through a Third-Party Social Media Service, Your contacts on the Third-Party Social Media Service may see Your
                            name, profile, pictures and description of Your activity. Similarly, other users will be able to view descriptions of Your
                            activity, communicate with You and view Your profile.
                        </Text>
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        <Text>
                            <Entypo name="dot-single" size={16} color={theme.colors.brandColor} />
                            With Your consent: We may disclose Your personal information for any other purpose with Your consent.
                            {'\n'}
                        </Text>
                    </ThemedText>
                </Card>

                <Card>
                    <ThemedText style={styles.textHeading}>Retention of Your Personal Data</ThemedText>
                    <ThemedText style={styles.text}>
                        The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy.
                        We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are
                        required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        The Company will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period
                        of time, except when this data is used to strengthen the security or to improve the functionality of Our Service, or We are legally
                        obligated to retain this data for longer time periods.{'\n'}
                    </ThemedText>
                </Card>

                <Card>
                    <ThemedText style={styles.textHeading}>Transfer of Your Personal Data</ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        Your information, including Personal Data, is processed at the Company&apos;s operating offices and in any other places
                        where the parties involved in the processing are located. It means that this information may be transferred to — and maintained
                        on — computers located outside of Your state, province, country or other governmental jurisdiction where the data protection laws
                        may differ than those from Your jurisdiction.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        Your consent to this Privacy Policy followed by Your submission of such information represents Your agreement to that transfer.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        The Company will take all steps reasonably necessary to ensure that Your data is treated securely and in accordance with this Privacy
                        Policy and no transfer of Your Personal Data will take place to an organization or a country unless there are adequate controls in place
                        including the security of Your data and other personal information.{'\n'}
                    </ThemedText>
                </Card>

                <Card>
                    <ThemedText style={styles.textHeading}>Delete Your Personal Data</ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        You have the right to delete or request that We assist in deleting the Personal Data that We have collected about You.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        Our Service may give You the ability to delete certain information about You from within the Service.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        You may update, amend, or delete Your information at any time by signing in to Your Account, if you have one, and visiting the account
                        settings section that allows you to manage Your personal information. You may also contact Us to request access to, correct, or delete
                        any personal information that You have provided to Us.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        Please note, however, that We may need to retain certain information when we have a legal obligation or lawful basis to do so.{'\n'}
                    </ThemedText>
                </Card>

                <Card>
                    <ThemedText style={styles.textHeading}>Disclosure of Your Personal Data{'\n'}</ThemedText>
                </Card>

                <Card>
                    <ThemedText style={styles.textHeading}>Business Transactions</ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        If the Company is involved in a merger, acquisition or asset sale, Your Personal Data may be transferred. We will provide notice before
                        Your Personal Data is transferred and becomes subject to a different Privacy Policy.{'\n'}
                    </ThemedText>
                </Card>

                <Card>
                    <ThemedText style={styles.textHeading}>Law enforcement</ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        Under certain circumstances, the Company may be required to disclose Your Personal Data if required to do so by law or in response to
                        valid requests by public authorities (e.g. a court or a government agency).{'\n'}
                    </ThemedText>
                </Card>

                <Card>
                    <ThemedText style={styles.textHeading}>Other legal requirements</ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        The Company may disclose Your Personal Data in the good faith belief that such action is necessary to:
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify" }]}>
                        <Entypo name="dot-single" size={16} color={theme.colors.brandColor} /> Comply with a legal obligation{'\n'}
                        <Entypo name="dot-single" size={16} color={theme.colors.brandColor} /> Protect and defend the rights or property of the Company{'\n'}
                        <Entypo name="dot-single" size={16} color={theme.colors.brandColor} /> Prevent or investigate possible wrongdoing in connection with the Service{'\n'}
                        <Entypo name="dot-single" size={16} color={theme.colors.brandColor} /> Protect the personal safety of Users of the Service or the public{'\n'}
                        <Entypo name="dot-single" size={16} color={theme.colors.brandColor} /> Protect against legal liability{'\n'}
                    </ThemedText>
                </Card>

                <Card>
                    <ThemedText style={styles.textHeading}>Security of Your Personal Data</ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet,
                        or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect Your
                        Personal Data, We cannot guarantee its absolute security.
                    </ThemedText>
                </Card>

                <Card>
                    <ThemedText style={[styles.subheading, { color: theme.colors.brandColor }]}>
                        <MaterialCommunityIcons
                            name="account-child"
                            size={20}
                            color={theme.colors.brandColor}
                        />{" "}
                        Children&apos;s Privacy
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information
                        from anyone under the age of 13. If You are a parent or guardian and You are aware that Your child has provided Us with Personal
                        Data, please contact Us. If We become aware that We have collected Personal Data from anyone under the age of 13 without verification
                        of parental consent, We take steps to remove that information from Our servers.{'\n'}{'\n'}

                        If We need to rely on consent as a legal basis for processing Your information and Your country requires consent from a parent, We may require
                        Your parent&apos;s consent before We collect and use that information.
                    </ThemedText>
                </Card>

                <Card>
                    <ThemedText style={[styles.subheading, { color: theme.colors.brandColor }]}>
                        <MaterialCommunityIcons
                            name="open-in-new"
                            size={20}
                            color={theme.colors.brandColor}
                        />{" "}
                        Links to Other Websites
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        Our Service may contain links to other websites that are not operated by Us. If You click on a third party link, You will
                        be directed to that third party&apos;s site. We strongly advise You to review the Privacy Policy of every site You visit.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.
                    </ThemedText>
                </Card>

                <Card>
                    <ThemedText style={[styles.subheading, { color: theme.colors.brandColor }]}>
                        <MaterialCommunityIcons
                            name="update"
                            size={20}
                            color={theme.colors.brandColor}
                        />{" "}
                        Changes to this Privacy Policy
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming effective and update the
                        &quot;Last updated&quot; date at the top of this Privacy Policy.
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective
                        when they are posted on this page.
                    </ThemedText>
                </Card>

                <Card>
                    <ThemedText style={[styles.subheading, { color: theme.colors.brandColor }]}>
                        <MaterialCommunityIcons
                            name="phone"
                            size={18}
                            color={theme.colors.brandColor}
                        />{" "}
                        Contact Us
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text, textAlign: "justify", }]}>
                        If you have any questions about this Privacy Policy, You can contact us:
                    </ThemedText>
                    <ThemedText style={[styles.text, { color: theme.colors.text }]}>
                        By email: support@international.nepalcan.com
                        By phone number: 01-5970736
                    </ThemedText>
                </Card>
            </ScrollView>
        </ThemedView>
    )
}

export default PrivacyPolicy

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
