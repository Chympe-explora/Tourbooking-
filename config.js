/* ============================================================
   ✏️  KREM CHYMPE — EDIT-THIS-FILE
   ============================================================

   THIS IS THE ONLY FILE YOU NEED TO OPEN TO CHANGE:
     • Prices               (window.KC_PRICES  below)
     • Photos                (window.KC_IMAGES  below)
     • Text on the website   (window.KC_CONTENT below)

   You do NOT need to open index.html, app.js, or admin.html for
   any of that. Leave those files alone.

   ------------------------------------------------------------
   HOW TO EDIT SAFELY — read this once before touching anything
   ------------------------------------------------------------
   1. Only change the part AFTER the colon ( : ).
      Example:  perPerson: 2600,
                            ^^^^ change this number only.
                Never delete or rename the word before the colon
                (e.g. "perPerson") — the website looks for that
                exact word.

   2. Numbers are written with NO ₹ symbol, NO commas inside them,
      and NO quote marks around them.
         Correct:    perPerson: 2600,
         Wrong:      perPerson: "₹2,600",

   3. Text (words/sentences) DOES need quote marks around it.
         Correct:    siteName: "KREM CHYMPE",
         Wrong:      siteName: KREM CHYMPE,

   4. Every line (except the very last one in a { } group) must
      end with a comma  ,   — this is the single most common
      mistake. If the site breaks after an edit, check that you
      didn't delete a comma or accidentally leave a trailing
      comma after the LAST item in a group.

   5. Anything after // on a line is just a note for humans —
      the website ignores it completely. Feel free to read them,
      never worry about breaking them.

   6. When you're done editing, save the file and push/upload it
      to GitHub the same way as before. That's the only extra
      step — GitHub Pages does the rest automatically within a
      minute or two.

   7. If something looks wrong after you publish, a red banner
      will appear at the top of the site telling you this file
      has a mistake in it, instead of the site just going blank.
      Undo your last change, save, and republish.
   ============================================================ */

(function () {
  "use strict";

  // ============================================================
  // 💰 SECTION 1 — PRICES
  // Every price shown anywhere on the site comes from here.
  // ============================================================
    window.KC_PRICES = {
      // ---- Shared Tour Package ----
      sharedTour: {
        perPerson: 2600,          // ₹ per paying person
        lunchThaliPrice: 380,     // ₹ per thali — optional add-on (veg/chicken/pork same price)
        thaliTypes: [
          { id: "veg",     name: "Veg Thali" },
          { id: "chicken", name: "Chicken Thali" },
          { id: "pork",    name: "Pork Thali" }
        ]
      },

      // ---- Guide Only Package ----
      // NOTE: this package was removed from the site (replaced by the
      // Private Package below) but the price is kept here in case you
      // ever want to bring it back — it isn't read by app.js anymore.
      guideOnly: {
        flat: 1500 // ₹ per group, fixed — no add-ons, no customization
      },

      // ---- Private Package (custom group tour, optional camping) ----
      privatePackage: {
        jeep: 4000,               // ₹ per group — optional 4x4 jeep
        guide: 1500,               // ₹ per group — mandatory local guide
        adventurePerPerson: 1500,  // ₹ per person — optional adventure activities
        lunchThaliPrice: 380,      // ₹ per thali (veg / chicken / pork all same price)
        thaliTypes: [
          { id: "veg",     name: "Veg Thali" },
          { id: "chicken", name: "Chicken Thali" },
          { id: "pork",    name: "Pork Thali" }
        ],
        // ---- Camping add-on (only charged if Camping = yes) ----
        campingTent: 1000,          // ₹ per tent
        campingMealsPerPerson: 380, // ₹ per person — veg only, dinner + breakfast
        overnightGuide: 2000        // ₹ per booking, mandatory once camping is chosen
      },

      // ---- Camping ----
      camping: {
        // Everything below is priced à la carte and simply added up — there
        // is no hidden "package" logic. A typical booking (1 tent + 1
        // person's meal + the mandatory guide) comes to ₹3,500
        // (1,000 + 500 + 2,000), which is why that figure is used for
        // marketing/"starting from" display, but a visitor who declines the
        // tent and meal and only wants the guide is simply charged ₹2,000.
        tent: 3500,            // marketing "starting from" display price only — not used directly in the calculator
        tentUnit: 1000,        // ₹ per tent selected (visitor can choose 0 or more)
        tentCapacity: 2,       // persons per tent
        mealsPerPerson: 500,   // ₹ per person, only charged if meals are selected
        overnightGuide: 2000,  // ₹ per booking, mandatory — always charged, regardless
                                // of how many tents or meals are selected
        jeep: 4000,             // ₹ per group — optional 4x4 pickup & drop service
        activitiesPerPerson: 1500 // ₹ per person — optional adventure activities bundle
                                   // (boat rafting, waterfall visit, swimming, cave
                                   // exploration, life jacket, basic first aid, entry fee)
      },

      // ---- Traditional Bamboo Dishes (Camping add-on menu) ----
      bambooMenu: [
        { id: "chicken500",   name: "Fresh Bamboo Chicken (500g)",     price: 699 },
        { id: "chicken1kg",   name: "Fresh Bamboo Chicken (1kg)",      price: 890 },
        { id: "pork500",      name: "Fresh Bamboo Pork (500g)",        price: 799 },
        { id: "pork1kg",      name: "Fresh Bamboo Pork (1kg)",         price: 1000 },
        { id: "porkbelly500", name: "Roasted Pork Belly Salad (500g)", price: 599 },
        { id: "porkbelly1kg", name: "Roasted Pork Belly Salad (1kg)",  price: 900 },
        { id: "fish",         name: "Boiled Fish (Zero Oil)",          price: 250 },
        { id: "vegsabji",     name: "Veg Bamboo Sabji",                price: 300 },
        { id: "egg",          name: "Boiled Egg",                     price: 20 },
        { id: "chai",         name: "Bamboo Chai",                    price: 20 }
      ],

      // ---- Editable child free age — changing this updates every
      // calculation that checks whether a child is charged. ----
      childFreeAge: 10,

      // ---- Children under childFreeAge are free of charge for the
      // package price / adventure activities themselves, but they still
      // use a life jacket and still go through the entry gate, so these
      // two small per-child fees are charged even for a "free" child
      // whenever activities are part of the booking (Shared Tour always
      // includes activities; Camping only when "Adventure Activities" is
      // selected). Adjust these two numbers any time. ----
      childJacketFee: 100,  // ₹ per free child — life jacket
      childEntryFee: 50,    // ₹ per free child — entry fee

      // ---- Minimum advance payment (₹) required to submit a booking ----
      minAdvance: 500
    };

  // ============================================================
  // 🖼️  SECTION 2 — PHOTOS
  // Filenames of the images used around the site. To change a
  // photo: upload your new image file into the frontend folder
  // (same place as this file), then type its exact filename here
  // (must match exactly, including capital letters and spaces).
  // ============================================================
    window.KC_IMAGES = {
      // Rotating homepage background photos
      heroBg1: "Blue watefall.jpg",
      heroBg2: "Blue watefall.jpg",

      // Section photos
      // heroCave was still pointing at a missing "images/hero-cave.jpg" —
      // set to "Cave entrance.jpg" for now. Change this to whichever photo
      // you'd rather use for the cave hero section.
      heroCave:    "Blue water cave.jpg",
      trekCard:    "Trekking.jpg",
      campingCard: "Camping un ex m.jpg",
      caveEntranceCard: "Cave entrance.jpg",

      // Guide photo and site logo
      guide: "guide.jpg",
      logo:  "logo.png",

      // Gallery photos (id 0-9, matches the categories shown on the site)
      gallery0: "Cave entrance.jpg",
      gallery1: "Blue watefall.jpg",
      gallery2: "Trekking.jpg",
      gallery3: "Camping un ex m.jpg",
      gallery4: "Rafting.jpg",
      gallery5: "Cave diving.jpg",
      gallery6: "Blue water cave.jpg",
      gallery7: "Rock formations.jpg",
      gallery8: "Happy waterfall.jpg",
      gallery9: "Camping.jpg",

      // Your UPI payment QR code image (shown on the Pricing / Pay page).
      // Leave blank ("") to keep the plain text placeholder instead.
      qrCode: "GooglePay_QR.png"
    };

  // ============================================================
  // 📝 SECTION 3 — TEXT ON THE WEBSITE
  // Every sentence, label, and button on the site comes from here.
  // ============================================================
    window.KC_CONTENT = {
      // ---- Site identity ----
      siteName: "KREM CHYMPE",
      siteSub: "ADVENTURE & CAMPING",

      // ---- Contact & payment details ----
      instagram: "https://www.instagram.com/unexplored_meghalaya?igsh=ZHZpODB3aXl0bXBu",
      whatsappNumber: "916001877518",
      upiId: "kremchympe@upi",
      bank: {
        name: "Krem Chympe Adventure",
        account: "123456789012",
        ifsc: "SBIN0001234",
        bankName: "SBI, Cherrapunji Branch"
      },

      // ---- Prices (in ₹) ----
      prices: {
        trek: 1500,          // shown as the "starting from" trek price
        camping: 3500,       // shown as the "starting from" camping price
        guide: 1500,         // mandatory guide fee, charged on every booking
        campingBase: 2000,   // reserved, not currently charged
        vehicleRainy: 2000,  // 4x4 vehicle - Rainy Half Way option
        vehicleWinter: 4000, // 4x4 vehicle - Winter Full Way option
        boat: 1000,          // reserved, not currently charged
        jacket: 100,         // reserved, not currently charged
        parking: 100,        // charged once per booking
        entry: 50             // charged per person
      },

      // ---- Meal options (shown with a quantity picker) ----
      meals: [
        { id: "bamboo_pork",  name: "Bamboo Pork",   price: 300, type: "non-veg" },
        { id: "chicken_curry",name: "Chicken Curry", price: 250, type: "non-veg" },
        { id: "maggie",       name: "Maggie",         price: 80, type: "veg" },
        { id: "tea",          name: "Red Tea",        price: 30, type: "veg" },
        { id: "rice",         name: "Steamed Rice",  price: 120, type: "veg" },
        { id: "salad",        name: "Local Salad",    price: 60, type: "veg" },
        { id: "pork_fry",     name: "Pork Fry",      price: 320, type: "non-veg" },
        { id: "egg_curry",    name: "Egg Curry",     price: 150, type: "non-veg" }
      ],

      // ---- Camping gear options (shown only for Camping bookings) ----
      campingItems: [
        { id: "tent",    name: "Tent (2 Person)",    price: 500 },
        { id: "torch",   name: "Torch + Batteries",   price: 50 },
        { id: "blanket", name: "Sleeping Blanket",   price: 100 },
        { id: "mat",     name: "Sleeping Mat",        price: 50 }
      ],

      // ---- On/off switches for whole sections. Set any of these to
      // false to remove that section from the site — no other file
      // needs to be touched. ----
      sections: {
        trustBar: true,       // the "Trusted by 1000+ Travelers / Google Rating..." bar under the hero
        ourStory: true,       // the "Our Story" timeline block
        statsRow: true,       // the 12KM / 2 Hour / 100+ / 4.9 stat tiles
        meetGuide: true,      // the "Meet Your Guide" card
        sharedTourCard: true, // the "Shared Tour" package card
        campingCard: true,    // the "Camping Experience" package card
        privatePackageCard: true, // the "Private Package" package card
        packagesTrustRow: true, // "Safe & Secure / Local Guides / Eco Friendly / 4.9 Rating" strip
        gallery: true         // the whole "Our Gallery" block
      },

      // ---- Navigation menu labels (top bar + mobile menu) ----
      nav: {
        items: ["Home", "Explore", "Packages", "Gallery", "Booking", "Contact"],
        mobileItems: ["Home", "Packages", "Gallery"]
      },

      // ---- "Trusted by..." strip under the hero ----
      trustBar: {
        trustedText: "Trusted by 100+",
        travelersText: "Travelers",
        googleRatingText: "Visitors Rating 4.9",
        safetyCertifiedText: "Safety Certified",
        ecoTourismText: "Eco Tourism"
      },

      // ---- "Our Story" timeline entries ----
      storyTimeline: [
        { year: "1990", title: "Cave Discovery", desc: "Local hunters discovered the massive cave system while tracking in the dense forests." },
        { year: "2015", title: "Tourism Began", desc: "Opened for eco-tourism with strict conservation guidelines and local community involvement." },
        { year: "2018", title: "Local Guides", desc: "Trained 25+ local guides from nearby villages, creating sustainable livelihoods." },
        { year: "Today", title: "Conservation", desc: "Protecting 12km trail, 100+ species, with zero-plastic and leave-no-trace policy." }
      ],

      // ---- Destination Details (featured on home page) ----
      destinationDetails: {
        title: "About Krem Chympe",
        subtitle: "India's Fifth-Longest Cave System",
        highlights: [
          {
            icon: "mountain",
            label: "India's 5th Longest Cave",
            description: "Krem Chympe is India's fifth-longest cave system, with approximately 10.5 kilometers of mapped passages. "Krem," in the local Khasi language, means "cave." This massive river cave system is also known as the "Elephant Cave" due to the discovery of elephant bones in the area. Located in the Jaintia Hills district, which is home to more than 1,200 caves—the highest concentration on the Indian subcontinent—Krem Chympe stands out as a unique "resurgent cave" where an underground river emerges after its subterranean journey."
          },
          {
            icon: "water",
            label: "Golden Orchid Chamber",
            description: "Within the cave system lies the stunning "Golden Orchid Chamber," featuring magnificent stalactites and stalagmites with golden-hued mineral deposits that shimmer like a field of flowers under torchlight."
          },
          {
            icon: "users",
            label: "50+ Natural Limestone Dams",
            description: "The cave is renowned for over 50 natural limestone dams known locally as "gours." These formations, some reaching heights of 12 meters, are created by the high concentration of calcium carbonate in the cave water—a testament to millions of years of geological transformation."
          },
          {
            icon: "leaf",
            label: "World's Largest Blind Cavefish",
            description: "The cave is home to the world's largest species of blind cavefish (Neolissochilus pnar), reaching lengths of up to 40 centimeters. These eyeless, albino giants represent a remarkable example of evolution in extreme environments."
          },
           {
           icon: "cave",
            label: "Cave-Adapted Bat Colonies",
            description: "Multiple bat species find refuge within the cave, their guano providing essential nutrients for the subterranean food chain."
          },
           {
           icon: "eco",
            label: "Delicate Ecosystem",
            description: "The cave's unique environment supports organisms that have evolved to survive in total darkness and isolation, making it a living laboratory of evolutionary adaptation."
        ],
        keyFeatures: [
          "Resurgent cave with underground river system",
          "Crystal-clear underground lake accessible to visitors",
          "Pristine forest trails with diverse biodiversity",
          "Safe & guided exploration for all fitness levels",
          "Zero-plastic, eco-friendly adventure experience"
        ]
      },

      // ---- Packages page header + trust strip ----
      packagesPage: {
        subtitle: "Choose your perfect adventure • 3 curated experiences",
        trustRow: ["Safe & Secure", "Local Guides", "Eco Friendly", "4.9 Rating"]
      },

      // ---- Package cards (Shared Tour / Camping / Guide Only) ----
      packages: {
        sharedTour: {
          badge: "Most Popular",
          name: "Shared Package",
          priceUnit: "Per Person",
          features: [
            "4×4 Vehicle Pickup & Drop",
            "Chympe Waterfall Visit",
            "Waterfall and Cave Swimming",
            "700m Cave Exploration",
            "Boat Rafting",
            "Entry Fee, Life Jacket & Basic First Aid",
            "Lunch thali optional",
            "Children under {childFreeAge} free (life jacket & entry fee still apply)"
          ]
        },
        camping: {
          badge: "Overnight",
          name: "Camping",
          priceUnit: "Per person",
          features: [
            "1 Tent, sleeping mats, camping chairs, torch & a bonfire",
            "Mandatory overnight guide",
            "Meals/person available (veg dinner + breakfast)",
            "Optional 4×4 jeep pickup & drop",
            "Optional adventure activities (rafting, waterfall, cave & more)",
            "Fresh bamboo-cooked dishes available(Optional)"
          ]
        },
        guideOnly: {
          badge: "Guide Only",
          name: "Guide Only",
          priceUnit: "Per Group",
          features: [
            "Certified local guide (mandatory)",
            "Basic first aid kit included"
          ]
        },
        privatePackage: {
          badge: "Private Tour",
          name: "Private Package",
          priceUnit: "Fully customizable",
          features: [
            "Optional 4×4 jeep",
            "lunch thalis",
            "Mandatory local guide",
            "Adventure activities",
            "Bamboo rafting",
            "Cave expedition & cave entry",
            "Swimming (cave & waterfall)",
            "Cliff jumping at Khaddum Fall",
            "Visit to Khaddum Fall (Chympe Fall)",
            "Add overnight camping with bamboo-cooked dishes"
          ]
        }
      },

      // ---- Gallery section ----
      galleryPage: {
        subtitle: "Moments from Krem Chympe",
        filters: ["All", "Cave", "Waterfall", "Camping", "Trek", "Bamboo rafting"],
        viewAllLabel: " View All Photos"
      },

      // ---- Shared Tour booking form text ----
      sharedTourBooking: {
        includedTitle: "Included in your package",
        includesLabel: "Includes:",
        includedItems: [
"Guide",
"Bamboo Rafting",
"Life Jacket",
"Basic First Aid",
"Entry Fee Included",
        "Adventure Activities Include:",
"Shared 4×4 Off-Roading",
"Scenic Forest Drive",
"Short Forest Trek",
"Bridge Viewpoint",
"Bamboo Rafting",
"700m Cave Exploration",
"Cave Cliff Jumping",
"Cave Swimming",
"Khaddum (Chympe) Waterfall Visit",
"Waterfall Swimming"
        ],
        childFreeText: "Note: Children under {childFreeAge} are free of charge, except for a small life jacket ({childJacketFee}) and entry fee ({childEntryFee}).",
        batchText: [
          "Note: One shared batch consists of 8 members.",
          "Advance booking must be completed at least 3 days before the tour.",
          "Booking is confirmed only after advance payment."
        ],
        adultsLabel: "Adults",
        childrenLabel: "Children",
        lunchTitle: "Lunch (optional)",
        lunchPriceUnit: " Per Person",
        lunchSubtitle: "Select your thali(s) and choose the quantity for each.",
        lunchIncludes: [
          "Includes chutney and pickle.",
          "All thali variants are priced equally."
        ]
      },

      // ---- Camping booking form text ----
      campingBooking: {
        adultsLabel: "Adults",
        childrenLabel: "Children",
        packageIncludesTitle: "Camping Essentials",
        includesLabel: "Available:",
        packageIncludesItems: [
          "Tent, sleeping mats, camping chairs & torch",
          "Meals (veg dinner + breakfast)",
          "Mandatory overnight guide"
        ],
        tentLabel: "Tents",
        tentPriceUnit: "/tent",
        tentNote: "Select the number of tents you'd like for your stay.",
        mealsLabelPrefix: "Meals (",
        mealsLabelSuffix: "/person)",
        mealsIncludes: "Includes: vegetarian dinner and breakfast with 2 servings of Maggi.",
        mealsNote: "Note: Vegetarian meals only.",
        mealsYes: "Yes",
        mealsNo: "No",
        guideTitle: "Overnight Guide",
        guideNoteTemplate: "Note: An overnight guide is mandatory for all camping bookings and covers guest safety and campsite supervision. Camping without a guide is not permitted. Children under {childFreeAge} are not charged for meals or activities, except a small life jacket ({childJacketFee}) and entry fee ({childEntryFee}) if activities are selected.",
        guideMandatoryLabel: "yes (mandatory)",
        jeepTitle: "4×4 Jeep (Pickup & Drop)",
        jeepPriceUnit: " Per Group",
        jeepNote: "Note: Optional pickup and drop service by 4×4 jeep, charged per group, not per person.",
        jeepYesLabel: "yes",
        jeepNoLabel: "No",
        activitiesTitle: "Adventure Activities",
        activitiesPriceUnit: "/person",
        activitiesIncludes: [
    "Scenic Forest Drive",
    "Guided Forest Trek",
    "Bridge Viewpoint",
    "Bamboo Rafting",
    "700m Cave Exploration",
    "Cave Cliff Jumping",
    "Cave Swimming",
    "Khaddum Waterfall Visit",
    "Waterfall Swimming",
    "Campfire",
    "Stargazing",
    "Overnight Camping",
    "Sunrise Nature Walk"
],
        activitiesNote: "Note: Optional adventure activities bundle, charged per person.",
        activitiesYesLabel: "yes",
        activitiesNoLabel: "No",
        bambooDishesTitle: " Traditional Bamboo Dishes(optional)"
      },
      // ---- Private Package booking form text ----
      privatePackageBooking: {
        peopleLabel: "Number of People",

        jeepTitle: "4×4 Jeep",
        jeepPriceUnit: " Per Group",
        jeepNote1: "Note: Without the 4×4 jeep, the trekking distance is approximately 20 km (round trip).",
        jeepNote2: "Note: The 4x4 jeep is charged per group, not per person.",
        jeepYesLabel: "yes",
        jeepNoLabel: "No",

        guideTitle: "Local Guide",
        guideNote1: "Note: A local guide is mandatory for all visitors, as this is an offbeat destination. The guide ensures your safety throughout the adventure activities.",
        guideNote2: "Note: The local guide is charged per group, not per person.",
        guideMandatoryLabel: "yes (mandatory)",

        adventureTitle: "Adventure Activities & Facilities",
        adventurePriceUnit: " Per Person",
        adventureIncludesLabel: "Includes:",
        adventureIncludes: [
    "Guide",
    "Bamboo Rafting",
    "Life Jacket",
    "Basic First Aid",
    "Entry Fee Included",
    "Scenic Forest Drive",
    "Forest Trek",
    "Bridge Viewpoint",
    "Private Bamboo Rafting",
    "700m Cave Exploration",
    "Cave Cliff Jumping",
    "Cave Swimming",
    "Khaddum (Chympe) Waterfall Visit",
    "Waterfall Swimming"
],
        adventureNote: "Note: If activities cannot be conducted due to weather or safety conditions, only the entry fee and life jacket fee will be charged.",
        adventureYesLabel: "yes",
        adventureNoLabel: "No",

        lunchTitle: "Lunch",
        lunchPriceUnit: " Per Person",
        lunchSubtitle: "Select your thali(s) and choose the quantity for each.",
        lunchIncludes: "Includes chutney and pickle. All thali variants are priced equally.",
        lunchEachSuffix: " each",

        campingTitle: "Camping",
        campingYesLabel: "yes",
        campingNoLabel: "No",

        campingDetailsTitle: "Camping Details",
        campingDetailsSubtitle: "Please fill in the details below to book your camping experience.",

        tentTitle: "Camping Tent Rental",
        tentPriceUnit: " Per Tent",
        tentIncludes: "Includes: Blanket, Pillows, Camping chairs.",
        tentNote: "Note: One tent can comfortably accommodate 2 people.",
        tentsLabel: "Number of tents",

        campingMealsTitle: "Meals",
        campingMealsPriceUnit: " Per Person",
        campingMealsIncludes: "Includes — Dinner: Veg Thali, Breakfast: 2 servings of Maggi.",
        campingMealsNote: "Note: Vegetarian meals only.",
        campingMealsYesLabel: "yes",
        campingMealsNoLabel: "No",

        overnightGuideTitle: "Overnight Guide",
        overnightGuideNote: "Important Note: An overnight guide is mandatory for all camping bookings, as the campsite is located far from the nearest village. For your safety and assistance, camping without a guide is not permitted. The guide will also prepare your dinner and breakfast.",
        overnightGuideMandatoryLabel: "yes (mandatory)",

        bambooDishesTitle: " Traditional Bamboo Dishes (Zero Oil)",
        bambooDishesDesc: "Available only with camping, as it requires extra preparation time and fresh ingredients."
      },

      // ---- Payment page text ----
      payment: {
        accountNameLabel: "Account Name",
        accountNumberLabel: "Account Number",
        ifscLabel: "IFSC",
        bankLabel: "Bank",
        advanceHelperText: "Minimum advance ₹500 required",
        advanceNote: "Advance min ₹500 to confirm",
        submitWhatsappLabel: " Submit via WhatsApp"
      },

      // ---- Homepage hero text ----
      hero: {
        badge: "MEGHALAYA-CHYMPE FALL-CAVE ADVENTURE",
        title: "Discover Meghalaya's Hidden Paradise",
        sub: "Embark on an unforgettable journey through Krem Chympe, one of India's longest cave systems with 20 km explored length wise it nestled in the heart of Meghalaya's mystical forests.",
        visitorsLabel: "Visitors",
        duration: "2 Hours Trek",
        priceLabel: "Starts ₹1500 Per Guide"
      },

      // Homepage rotating background photos (file names come from KC_IMAGES above)
      backgrounds: [window.KC_IMAGES.heroBg1, window.KC_IMAGES.heroBg2],

      // ---- Guide bio ----
      guide: {
        name: "Senly Suchiang",
        role: "Lead Guide & Conservationist",
        bio: "Born in the hills of Meghalaya, Senly is a local and he has explored Krem Chympe cave and chympe waterfall since childhood. He is a certified caver and guide.",
        image: window.KC_IMAGES.guide
      },

      logoImage: window.KC_IMAGES.logo,

      // Section photos (file names come from KC_IMAGES above)
      sectionImages: {
        heroCave: window.KC_IMAGES.heroCave,
        trekCard: window.KC_IMAGES.trekCard,
        campingCard: window.KC_IMAGES.campingCard,
        sharedPackageCard: window.KC_IMAGES.caveEntranceCard,
        privatePackageCard: window.KC_IMAGES.trekCard
      },

      // ---- Gallery: category label + photo for each tile ----
      // "span" controls the tile's size in the grid — leave as-is unless
      // you want to change the layout.
      galleryImages: [
        { id: 0, cat: "Cave",      src: window.KC_IMAGES.gallery0, span: "col-span-8 row-span-2" },
        { id: 1, cat: "Waterfall", src: window.KC_IMAGES.gallery1, span: "col-span-4" },
        { id: 2, cat: "Trek",      src: window.KC_IMAGES.gallery2, span: "col-span-4" },
        { id: 3, cat: "Camping",   src: window.KC_IMAGES.gallery3, span: "col-span-4" },
        { id: 4, cat: "Bamboo rafting",     src: window.KC_IMAGES.gallery4, span: "col-span-4" },
        { id: 5, cat: "Cave",      src: window.KC_IMAGES.gallery5, span: "col-span-4" },
        { id: 6, cat: "Cave", src: window.KC_IMAGES.gallery6, span: "col-span-8" },
        { id: 7, cat: "Rock formation",      src: window.KC_IMAGES.gallery7, span: "col-span-4" },
        { id: 8, cat: "Waterfall",      src: window.KC_IMAGES.gallery8, span: "col-span-4" },
        { id: 9, cat: "Camping",   src: window.KC_IMAGES.gallery9, span: "col-span-4" }
      ],

      // ---- Fixed interface words (button labels, headings, form labels) ----
      // These used to be hard-coded inside the app itself. Now every one of
      // them reads from here first, so you can reword any of them the same
      // way as everything else above — change the text, save, refresh.
      ui: {
        bookNow: "Book Now",
        payNow: "Pay Now",
        next: "Next ",
        nextViewPricing: "Next — View Pricing ",
        back: " Back",
        backToHome: "Back to Home",

        fullName: "Full Name",
        whatsappNumberLabel: "WhatsApp Number",
        numberOfPeople: "Number of People",
        dateLabel: "Date",
        peopleLabel: "People",
        packageLabel: "Package",
        totalLabel: "Total",

        guideMandatory: "Guide Mandatory",
        vehicleLabel: "4x4 Vehicle",
        campingGear: " Camping Gear",
        mealOptions: " Meal Options",
        noVehicleLabel: "No Vehicle",
        freeWalkLabel: "Free / Walk",
        rainyHalfWayLabel: "Rainy Half Way",
        winterFullWayLabel: "Winter Full Way",

        visitors: " Visitors",
        duration: " Duration",
        price: " Price",
        visitorRange: "1 - 5 People",

        paymentOptionsTitle: "Payment Options",
        orderSummary: "Order Summary",
        qrScannerLabel: "QR Scanner",
        upiIdLabel: "UPI ID",
        bankTransferLabel: "Bank Transfer",
        scanToPayLabel: "Scan to Pay ₹",
        downloadQr: " Download QR",
        balanceLeftLabel: "Balance left to pay on arrival: ₹",

        bookingConfirmedTitle: "Booking Confirmed!",
        thankYouPrefix: "Thank you ",
        thankYouMiddle: "! Your adventure is secured. We have received advance ₹",
        thankYouBalanceMid: ". Balance ₹",
        thankYouSuffix: " to be paid on arrival.",

        ourStory: "Our Story",
        meetYourGuide: "Meet Your Guide",
        ourGallery: "Our Gallery",
        ourAdventurePackages: "Our Adventure Packages",
        pricingFacilities: "Pricing & Facilities",
        totalCalculator: "Total Calculator",
        totalAmount: "Total Amount",

        statForestTrailLabel: "Forest Trail",
        statAverageTrekLabel: "Average Trek",
        statSpeciesLabel: "Species",
        statGoogleRatingLabel: "Visitors Rating"
      }
    };

  // ============================================================
  // 🛑 DO NOT EDIT ANYTHING BELOW THIS LINE
  // ============================================================
  // This part double-checks your edits above and shows a clear
  // warning banner on the website if something looks wrong,
  // instead of the site just breaking silently.
  var problems = [];
  function need(obj, path, type) {
    var parts = path.split(".");
    var v = obj;
    for (var i = 0; i < parts.length; i++) {
      if (v == null) { problems.push(path + " is missing."); return; }
      v = v[parts[i]];
    }
    if (v == null) { problems.push(path + " is missing."); return; }
    if (type === "number" && (typeof v !== "number" || isNaN(v))) {
      problems.push(path + " should be a plain number (no ₹, no quotes, no commas) — got: " + JSON.stringify(v));
    }
    if (type === "string" && typeof v !== "string") {
      problems.push(path + " should be text in quotes — got: " + JSON.stringify(v));
    }
  }

  need(window.KC_PRICES, "sharedTour.perPerson", "number");
  need(window.KC_PRICES, "sharedTour.lunchThaliPrice", "number");
  need(window.KC_PRICES, "camping.tentUnit", "number");
  need(window.KC_PRICES, "camping.mealsPerPerson", "number");
  need(window.KC_PRICES, "camping.overnightGuide", "number");
  need(window.KC_PRICES, "camping.jeep", "number");
  need(window.KC_PRICES, "privatePackage.jeep", "number");
  need(window.KC_PRICES, "privatePackage.guide", "number");
  need(window.KC_PRICES, "childFreeAge", "number");
  need(window.KC_PRICES, "childJacketFee", "number");
  need(window.KC_PRICES, "childEntryFee", "number");
  need(window.KC_PRICES, "minAdvance", "number");
  need(window.KC_CONTENT, "siteName", "string");
  need(window.KC_CONTENT, "whatsappNumber", "string");
  if (window.KC_CONTENT && window.KC_CONTENT.whatsappNumber && !/^\d{10,15}$/.test(window.KC_CONTENT.whatsappNumber)) {
    problems.push("whatsappNumber should be digits only, with country code, no + or spaces (e.g. 916001877518) — got: " + JSON.stringify(window.KC_CONTENT.whatsappNumber));
  }

  if (problems.length && typeof window.showConfigError === "function") {
    window.showConfigError(
      "Found " + problems.length + " problem(s) in config.js: " + problems.join(" | ")
    );
  }
})();
