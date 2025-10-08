import {  MD3LightTheme } from "react-native-paper";

export const customTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Primary colors (your main brand color)
    primary: "#A0CE4E", // Your main lime green
    onPrimary: "#FFFFFF", // White text on primary
    primaryContainer: "#E8F5D6", // Light green container
    onPrimaryContainer: "#2E5016", // Dark green text on light container

    // Secondary colors (complementary greens)
    secondary: "#7CB342", // Darker green
    onSecondary: "#FFFFFF", // White text on secondary
    secondaryContainer: "#DCEDC8", // Very light green
    onSecondaryContainer: "#1B5E20", // Very dark green

    // Tertiary colors (accent with white/gray)
    tertiary: "#66BB6A", // Medium green
    onTertiary: "#FFFFFF", // White text
    tertiaryContainer: "#C8E6C9", // Light green container
    onTertiaryContainer: "#1B5E20", // Dark green text

    // Surface colors (clean whites and light grays)
    surface: "#FFFFFF", // Pure white
    onSurface: "#1C1B1F", // Dark text on white
    surfaceVariant: "#F8F9FA", // Very light gray
    onSurfaceVariant: "#49454F", // Medium gray text

    // Background colors
    background: "#FFFFFF", // White background
    onBackground: "#1C1B1F", // Dark text on background

    // Outline colors
    outline: "#A0CE4E", // Use your brand color for outlines
    outlineVariant: "#CAC4D0", // Light gray for subtle outlines

    // Error colors (keeping standard red but with your green tint)
    error: "#BA1A1A",
    onError: "#FFFFFF",
    errorContainer: "#FFDAD6",
    onErrorContainer: "#410002",
  },
};




export const countries = [
  { code: "AF", number: "93", name: "Afghanistan (+93)" },
  { code: "AL", number: "355", name: "Albania (+355)" },
  { code: "DZ", number: "213", name: "Algeria (+213)" },
  { code: "AD", number: "376", name: "Andorra (+376)" },
  { code: "AO", number: "244", name: "Angola (+244)" },
  { code: "AR", number: "54", name: "Argentina (+54)" },
  { code: "AM", number: "374", name: "Armenia (+374)" },
  { code: "AU", number: "61", name: "Australia (+61)" },
  { code: "AT", number: "43", name: "Austria (+43)" },
  { code: "AZ", number: "994", name: "Azerbaijan (+994)" },
  { code: "BH", number: "973", name: "Bahrain (+973)" },
  { code: "BD", number: "880", name: "Bangladesh (+880)" },
  { code: "BY", number: "375", name: "Belarus (+375)" },
  { code: "BE", number: "32", name: "Belgium (+32)" },
  { code: "BJ", number: "229", name: "Benin (+229)" },
  { code: "BO", number: "591", name: "Bolivia (+591)" },
  { code: "BR", number: "55", name: "Brazil (+55)" },
  { code: "BG", number: "359", name: "Bulgaria (+359)" },
  { code: "BF", number: "226", name: "Burkina Faso (+226)" },
  { code: "BI", number: "257", name: "Burundi (+257)" },
  { code: "KH", number: "855", name: "Cambodia (+855)" },
  { code: "CM", number: "237", name: "Cameroon (+237)" },
  { code: "CA", number: "1", name: "Canada (+1)" },
  { code: "TD", number: "235", name: "Chad (+235)" },
  { code: "CL", number: "56", name: "Chile (+56)" },
  { code: "CN", number: "86", name: "China (+86)" },
  { code: "CO", number: "57", name: "Colombia (+57)" },
  { code: "KM", number: "269", name: "Comoros (+269)" },
  { code: "CG", number: "242", name: "Congo Brazzaville (+242)" },
  { code: "CD", number: "243", name: "Congo Kinshasa (+243)" },
  { code: "CR", number: "506", name: "Costa Rica (+506)" },
  { code: "CI", number: "225", name: "Côte d'Ivoire (+225)" },
  { code: "HR", number: "385", name: "Croatia (+385)" },
  { code: "CU", number: "53", name: "Cuba (+53)" },
  { code: "CY", number: "357", name: "Cyprus (+357)" },
  { code: "CZ", number: "420", name: "Czech Republic (+420)" },
  { code: "DK", number: "45", name: "Denmark (+45)" },
  { code: "DJ", number: "253", name: "Djibouti (+253)" },
  { code: "EG", number: "20", name: "Egypt (+20)" },
  { code: "SV", number: "503", name: "El Salvador (+503)" },
  { code: "EE", number: "372", name: "Estonia (+372)" },
  { code: "ET", number: "251", name: "Ethiopia (+251)" },
  { code: "FI", number: "358", name: "Finland (+358)" },
  { code: "FR", number: "33", name: "France (+33)" },
  { code: "GA", number: "241", name: "Gabon (+241)" },
  { code: "GM", number: "220", name: "Gambia (+220)" },
  { code: "GE", number: "995", name: "Georgia (+995)" },
  { code: "DE", number: "49", name: "Germany (+49)" },
  { code: "GH", number: "233", name: "Ghana (+233)" },
  { code: "GR", number: "30", name: "Greece (+30)" },
  { code: "GT", number: "502", name: "Guatemala (+502)" },
  { code: "HN", number: "504", name: "Honduras (+504)" },
  { code: "HK", number: "852", name: "Hong Kong (+852)" },
  { code: "HU", number: "36", name: "Hungary (+36)" },
  { code: "IS", number: "354", name: "Iceland (+354)" },
  { code: "IN", number: "91", name: "India (+91)" },
  { code: "ID", number: "62", name: "Indonesia (+62)" },
  { code: "IR", number: "98", name: "Iran (+98)" },
  { code: "IQ", number: "964", name: "Iraq (+964)" },
  { code: "IE", number: "353", name: "Ireland (+353)" },
  { code: "IL", number: "972", name: "Israel (+972)" },
  { code: "IT", number: "39", name: "Italy (+39)" },
  { code: "JM", number: "1-876", name: "Jamaica (+1-876)" },
  { code: "JP", number: "81", name: "Japan (+81)" },
  { code: "JO", number: "962", name: "Jordan (+962)" },
  { code: "KZ", number: "7", name: "Kazakhstan (+7)" },
  { code: "KE", number: "254", name: "Kenya (+254)" },
  { code: "KR", number: "82", name: "South Korea (+82)" },
  { code: "KW", number: "965", name: "Kuwait (+965)" },
  { code: "LA", number: "856", name: "Laos (+856)" },
  { code: "LV", number: "371", name: "Latvia (+371)" },
  { code: "LB", number: "961", name: "Lebanon (+961)" },
  { code: "LY", number: "218", name: "Libya (+218)" },
  { code: "LT", number: "370", name: "Lithuania (+370)" },
  { code: "LU", number: "352", name: "Luxembourg (+352)" },
  { code: "MG", number: "261", name: "Madagascar (+261)" },
  { code: "MW", number: "265", name: "Malawi (+265)" },
  { code: "MY", number: "60", name: "Malaysia (+60)" },
  { code: "MV", number: "960", name: "Maldives (+960)" },
  { code: "ML", number: "223", name: "Mali (+223)" },
  { code: "MX", number: "52", name: "Mexico (+52)" },
  { code: "MN", number: "976", name: "Mongolia (+976)" },
  { code: "MA", number: "212", name: "Morocco (+212)" },
  { code: "MZ", number: "258", name: "Mozambique (+258)" },
  { code: "NA", number: "264", name: "Namibia (+264)" },
  { code: "NP", number: "977", name: "Nepal (+977)" },
  { code: "NL", number: "31", name: "Netherlands (+31)" },
  { code: "NZ", number: "64", name: "New Zealand (+64)" },
  { code: "NI", number: "505", name: "Nicaragua (+505)" },
  { code: "NG", number: "234", name: "Nigeria (+234)" },
  { code: "NO", number: "47", name: "Norway (+47)" },
  { code: "OM", number: "968", name: "Oman (+968)" },
  { code: "PK", number: "92", name: "Pakistan (+92)" },
  { code: "PA", number: "507", name: "Panama (+507)" },
  { code: "PY", number: "595", name: "Paraguay (+595)" },
  { code: "PE", number: "51", name: "Peru (+51)" },
  { code: "PH", number: "63", name: "Philippines (+63)" },
  { code: "PL", number: "48", name: "Poland (+48)" },
  { code: "PT", number: "351", name: "Portugal (+351)" },
  { code: "QA", number: "974", name: "Qatar (+974)" },
  { code: "RO", number: "40", name: "Romania (+40)" },
  { code: "RU", number: "7", name: "Russia (+7)" },
  { code: "SA", number: "966", name: "Saudi Arabia (+966)" },
  { code: "SN", number: "221", name: "Senegal (+221)" },
  { code: "RS", number: "381", name: "Serbia (+381)" },
  { code: "SG", number: "65", name: "Singapore (+65)" },
  { code: "ZA", number: "27", name: "South Africa (+27)" },
  { code: "ES", number: "34", name: "Spain (+34)" },
  { code: "LK", number: "94", name: "Sri Lanka (+94)" },
  { code: "SE", number: "46", name: "Sweden (+46)" },
  { code: "CH", number: "41", name: "Switzerland (+41)" },
  { code: "TW", number: "886", name: "Taiwan (+886)" },
  { code: "TZ", number: "255", name: "Tanzania (+255)" },
  { code: "TH", number: "66", name: "Thailand (+66)" },
  { code: "TG", number: "228", name: "Togo (+228)" },
  { code: "TN", number: "216", name: "Tunisia (+216)" },
  { code: "TR", number: "90", name: "Turkey (+90)" },
  { code: "UA", number: "380", name: "Ukraine (+380)" },
  { code: "AE", number: "971", name: "United Arab Emirates (+971)" },
  { code: "GB", number: "44", name: "United Kingdom (+44)" },
  { code: "US", number: "1", name: "United States (+1)" },
  { code: "UY", number: "598", name: "Uruguay (+598)" },
  { code: "UZ", number: "998", name: "Uzbekistan (+998)" },
  { code: "VE", number: "58", name: "Venezuela (+58)" },
  { code: "VN", number: "84", name: "Vietnam (+84)" },
  { code: "YE", number: "967", name: "Yemen (+967)" },
  { code: "ZM", number: "260", name: "Zambia (+260)" },
  { code: "ZW", number: "263", name: "Zimbabwe (+263)" },
];