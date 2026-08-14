/* Krem Chympe — Adventure & Camping
   Rebuilt, human-readable app.js (previous app.js was a minified/bundled
   production build with no available source — this replaces it with an
   equivalent, editable implementation, reproducing the same visual design,
   plus the centralized Price Settings and three-package booking system).
*/
(function () {
  "use strict";
  var h = React.createElement;
  var useState = React.useState, useEffect = React.useEffect, useMemo = React.useMemo;

  var CONTENT = window.KC_CONTENT;
  var PRICES = window.KC_PRICES;
  var ui = CONTENT.ui || {};
  var t = function (key, fallback) { return (ui && ui[key]) || fallback; };

  // Section on/off switches (edit window.KC_CONTENT.sections in config.js)
  var SECTIONS = Object.assign({
    trustBar: true, ourStory: true, statsRow: true, meetGuide: true,
    sharedTourCard: true, campingCard: true, privatePackageCard: true,
    packagesTrustRow: true, gallery: true
  }, CONTENT.sections || {});

  var TRUST = Object.assign({
    trustedText: "Trusted by 1000+", travelersText: "Travelers",
    googleRatingText: "Google Rating 4.9", safetyCertifiedText: "Safety Certified",
    ecoTourismText: "Eco Tourism"
  }, CONTENT.trustBar || {});

  var STORY_TIMELINE = CONTENT.storyTimeline || [];

  // Fills "{token}" placeholders in a template string with values from a map
  function fill(template, values) {
    return template.replace(/\{(\w+)\}/g, function (m, key) {
      return values.hasOwnProperty(key) ? values[key] : m;
    });
  }

  // Normalizes a content field that may be authored as either a single
  // string or an array of strings (one per line) into an array.
  function toLines(v) {
    return Array.isArray(v) ? v : (v ? [v] : []);
  }

  // ---------------------------------------------------------------------
  // Icons (lucide-style inline SVGs, matching the icon set already in use)
  // ---------------------------------------------------------------------
  function makeIcon(paths) {
    return function (props) {
      props = props || {};
      var size = props.size || 24;
      return h(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          width: size,
          height: size,
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 2,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          className: props.className || ""
        },
        paths.map(function (p, i) {
          return h(p[0], Object.assign({ key: i }, p[1]));
        })
      );
    };
  }

  var ArrowLeft = makeIcon([["path", { d: "m12 19-7-7 7-7" }], ["path", { d: "M19 12H5" }]]);
  var ArrowRight = makeIcon([["path", { d: "M5 12h14" }], ["path", { d: "m12 5 7 7-7 7" }]]);
  var Award = makeIcon([
    ["path", { d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" }],
    ["circle", { cx: 12, cy: 8, r: 6 }]
  ]);
  var Building2 = makeIcon([
    ["path", { d: "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" }],
    ["path", { d: "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" }],
    ["path", { d: "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" }],
    ["path", { d: "M10 6h4" }], ["path", { d: "M10 10h4" }], ["path", { d: "M10 14h4" }], ["path", { d: "M10 18h4" }]
  ]);
  var Camera = makeIcon([
    ["path", { d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" }],
    ["circle", { cx: 12, cy: 13, r: 3 }]
  ]);
  var Check = makeIcon([["path", { d: "M20 6 9 17l-5-5" }]]);
  var ChevronDown = makeIcon([["path", { d: "m6 9 6 6 6-6" }]]);
  var Clock = makeIcon([["circle", { cx: 12, cy: 12, r: 10 }], ["polyline", { points: "12 6 12 12 16 14" }]]);
  var Compass = makeIcon([
    ["path", { d: "m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" }],
    ["circle", { cx: 12, cy: 12, r: 10 }]
  ]);
  var Copy = makeIcon([
    ["rect", { width: 14, height: 14, x: 8, y: 8, rx: 2, ry: 2 }],
    ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }]
  ]);
  var CreditCard = makeIcon([["rect", { width: 20, height: 14, x: 2, y: 5, rx: 2 }], ["line", { x1: 2, x2: 22, y1: 10, y2: 10 }]]);
  var Download = makeIcon([
    ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }],
    ["polyline", { points: "7 10 12 15 17 10" }],
    ["line", { x1: 12, x2: 12, y1: 15, y2: 3 }]
  ]);
  var IndianRupee = makeIcon([
    ["path", { d: "M6 3h12" }], ["path", { d: "M6 8h12" }], ["path", { d: "m6 13 8.5 8" }],
    ["path", { d: "M6 13h3" }], ["path", { d: "M9 13c6.667 0 6.667-10 0-10" }]
  ]);
  var Leaf = makeIcon([
    ["path", { d: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" }],
    ["path", { d: "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" }]
  ]);
  var MapPin = makeIcon([
    ["path", { d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" }],
    ["circle", { cx: 12, cy: 10, r: 3 }]
  ]);
  var Menu = makeIcon([["line", { x1: 4, x2: 20, y1: 12, y2: 12 }], ["line", { x1: 4, x2: 20, y1: 6, y2: 6 }], ["line", { x1: 4, x2: 20, y1: 18, y2: 18 }]]);
  var Minus = makeIcon([["path", { d: "M5 12h14" }]]);
  var Mountain = makeIcon([["path", { d: "m8 3 4 8 5-5 5 15H2L8 3z" }]]);
  var Phone = makeIcon([["path", { d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" }]]);
  var Plus = makeIcon([["path", { d: "M5 12h14" }], ["path", { d: "M12 5v14" }]]);
  var QrCode = makeIcon([
    ["rect", { width: 5, height: 5, x: 3, y: 3, rx: 1 }], ["rect", { width: 5, height: 5, x: 16, y: 3, rx: 1 }],
    ["rect", { width: 5, height: 5, x: 3, y: 16, rx: 1 }], ["path", { d: "M21 16h-3a2 2 0 0 0-2 2v3" }],
    ["path", { d: "M21 21v.01" }], ["path", { d: "M12 7v3a2 2 0 0 1-2 2H7" }], ["path", { d: "M3 12h.01" }],
    ["path", { d: "M12 3h.01" }], ["path", { d: "M12 16v.01" }], ["path", { d: "M16 12h1" }],
    ["path", { d: "M21 12v.01" }], ["path", { d: "M12 21v-1" }]
  ]);
  var Shield = makeIcon([["path", { d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" }]]);
  var Star = makeIcon([["path", { d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" }]]);
  var Tent = makeIcon([["path", { d: "M3.5 21 14 3" }], ["path", { d: "M20.5 21 10 3" }], ["path", { d: "M15.5 21 12 15l-3.5 6" }], ["path", { d: "M2 21h20" }]]);
  var Upload = makeIcon([
    ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }],
    ["polyline", { points: "17 8 12 3 7 8" }],
    ["line", { x1: 12, x2: 12, y1: 3, y2: 15 }]
  ]);
  var Users = makeIcon([
    ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }], ["circle", { cx: 9, cy: 7, r: 4 }],
    ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87" }], ["path", { d: "M16 3.13a4 4 0 0 1 0 7.75" }]
  ]);
  var Utensils = makeIcon([
    ["path", { d: "M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" }], ["path", { d: "M7 2v20" }],
    ["path", { d: "M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" }]
  ]);
  var X = makeIcon([["path", { d: "M18 6 6 18" }], ["path", { d: "m6 6 12 12" }]]);

  // ---------------------------------------------------------------------
  // Shared little components
  // ---------------------------------------------------------------------
  function GlassCard(props) {
    return h(
      "div",
      { className: "backdrop-blur-[24px] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] " + (props.className || "") },
      props.children
    );
  }

  function Stepper(props) {
    var value = props.value, onChange = props.onChange, min = props.min == null ? 0 : props.min;
    return h(
      "div",
      { className: "flex items-center gap-2 bg-white/10 rounded-full p-1 border border-white/10" },
      h("button", { onClick: function () { onChange(Math.max(min, value - 1)); }, className: "w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white" }, h(Minus, { size: 14 })),
      h("span", { className: "w-6 text-center text-white text-sm font-medium" }, value),
      h("button", { onClick: function () { onChange(value + 1); }, className: "w-7 h-7 rounded-full bg-[#2E8B57] hover:bg-[#257a4b] flex items-center justify-center text-white" }, h(Plus, { size: 14 }))
    );
  }

  function money(n) { return "₹" + Number(n || 0).toLocaleString("en-IN"); }

  // ---------------------------------------------------------------------
  // Pricing logic — every number below is read from window.KC_PRICES only
  // ---------------------------------------------------------------------
  function payingChildrenCount(childAges) {
    return childAges.filter(function (a) { return Number(a) >= PRICES.childFreeAge; }).length;
  }

  // A child under childFreeAge doesn't pay the package/activities price,
  // but still uses a life jacket and still goes through the entry gate —
  // so this small flat fee is charged per free child whenever activities
  // are actually part of the booking.
  function freeChildFee() {
    return Number(PRICES.childJacketFee || 0) + Number(PRICES.childEntryFee || 0);
  }

  function sharedTourTotals(f) {
    var payingChildren = payingChildrenCount(f.childAges);
    var payingPersons = Number(f.adults || 0) + payingChildren;
    var freeChildren = f.childAges.length - payingChildren;
    var ST = PRICES.sharedTour;
    var lunchLines = (ST.thaliTypes || []).map(function (th) {
      var qty = Number((f.lunchQty || {})[th.id] || 0);
      return { id: th.id, name: th.name, qty: qty, price: ST.lunchThaliPrice, cost: qty * ST.lunchThaliPrice };
    });
    var lunchCost = lunchLines.reduce(function (s, l) { return s + l.cost; }, 0);
    // Shared Tour always includes the adventure activities, so every free
    // child on this package is charged the life jacket + entry fee.
    var childFeeCost = freeChildren * freeChildFee();
    return {
      adults: Number(f.adults || 0),
      freeChildren: freeChildren,
      payingPersons: payingPersons,
      pricePerPerson: ST.perPerson,
      lunchLines: lunchLines, lunchCost: lunchCost,
      childFeeCost: childFeeCost,
      grandTotal: payingPersons * ST.perPerson + lunchCost + childFeeCost
    };
  }

  function campingTotals(f) {
    var payingChildren = payingChildrenCount(f.childAges);
    var payingHeads = Number(f.adults || 0) + payingChildren;
    var freeChildren = f.childAges.length - payingChildren;
    // Every line below is priced à la carte and simply summed — a visitor
    // can select 0 tents and decline meals and still book, paying only the
    // mandatory guide fee.
    var tentsSelected = Math.max(0, Number(f.tents || 0));
    var tentCost = tentsSelected * PRICES.camping.tentUnit;
    var mealsCost = f.meals === "yes" ? payingHeads * PRICES.camping.mealsPerPerson : 0;
    var guideCost = PRICES.camping.overnightGuide; // mandatory, always charged
    var jeepCost = f.jeep === "yes" ? PRICES.camping.jeep : 0;
    var activitiesCost = f.activities === "yes" ? payingHeads * PRICES.camping.activitiesPerPerson : 0;
    // Free children only need a life jacket + entry fee if they're
    // actually joining the adventure activities.
    var childFeeCost = f.activities === "yes" ? freeChildren * freeChildFee() : 0;
    var foodLines = PRICES.bambooMenu.map(function (item) {
      var qty = Number((f.foodQty || {})[item.id] || 0);
      return { id: item.id, name: item.name, qty: qty, price: item.price, cost: qty * item.price };
    });
    var foodCost = foodLines.reduce(function (sum, l) { return sum + l.cost; }, 0);
    return {
      payingHeads: payingHeads, tentsSelected: tentsSelected, tentCost: tentCost,
      mealsCost: mealsCost, guideCost: guideCost, jeepCost: jeepCost, activitiesCost: activitiesCost,
      childFeeCost: childFeeCost,
      foodLines: foodLines, foodCost: foodCost,
      grandTotal: tentCost + mealsCost + guideCost + jeepCost + activitiesCost + childFeeCost + foodCost
    };
  }

  function guideOnlyTotals() {
    return { price: PRICES.guideOnly.flat, grandTotal: PRICES.guideOnly.flat };
  }

  function privatePackageTotals(f) {
    var PP = PRICES.privatePackage;
    var people = Math.max(1, Number(f.people || 1));

    var jeepCost = f.jeep === "yes" ? PP.jeep : 0;
    var campingOn = f.camping === "yes";
    // The day-guide fee only applies when the group is NOT camping. Once
    // camping is chosen, the (mandatory) Overnight Guide fee below covers
    // guiding instead, so the separate Local Guide fee must not be charged.
    var guideCost = campingOn ? 0 : PP.guide;
    var activitiesCost = f.adventure === "yes" ? people * PP.adventurePerPerson : 0;

    var lunchLines = PP.thaliTypes.map(function (th) {
      var qty = Number((f.lunchQty || {})[th.id] || 0);
      return { id: th.id, name: th.name, qty: qty, price: PP.lunchThaliPrice, cost: qty * PP.lunchThaliPrice };
    });
    var lunchCost = lunchLines.reduce(function (s, l) { return s + l.cost; }, 0);

    var tentCost = campingOn ? Number(f.tents || 0) * PP.campingTent : 0;
    var campingMealsCost = campingOn && f.campingMeals === "yes" ? people * PP.campingMealsPerPerson : 0;
    var overnightGuideCost = campingOn ? PP.overnightGuide : 0;
    var bambooLines = campingOn ? PRICES.bambooMenu.map(function (item) {
      var qty = Number((f.bambooQty || {})[item.id] || 0);
      return { id: item.id, name: item.name, qty: qty, price: item.price, cost: qty * item.price };
    }) : [];
    var bambooCost = bambooLines.reduce(function (s, l) { return s + l.cost; }, 0);

    return {
      people: people, jeepCost: jeepCost, guideCost: guideCost, activitiesCost: activitiesCost,
      lunchLines: lunchLines, lunchCost: lunchCost,
      campingOn: campingOn, tentCost: tentCost, campingMealsCost: campingMealsCost,
      overnightGuideCost: overnightGuideCost, bambooLines: bambooLines, bambooCost: bambooCost,
      grandTotal: jeepCost + guideCost + activitiesCost + lunchCost + tentCost + campingMealsCost + overnightGuideCost + bambooCost
    };
  }

  // ---------------------------------------------------------------------
  // Child-age inputs (shared by Shared Tour & Camping forms)
  // ---------------------------------------------------------------------
  function ChildAgesInput(props) {
    var count = props.count, ages = props.ages, onChange = props.onChange;
    if (!count) return null;
    return h(
      "div", { className: "mt-3 grid grid-cols-2 md:grid-cols-4 gap-2" },
      Array.from({ length: count }).map(function (_, i) {
        return h(
          "label", { key: i, className: "block" },
          h("span", { className: "text-[11px] text-white/50" }, "Child " + (i + 1) + " age"),
          h("input", {
            type: "number", min: 0, max: 17, value: ages[i] == null ? "" : ages[i],
            onChange: function (e) {
              var next = ages.slice(); next[i] = e.target.value; onChange(next);
            },
            className: "mt-1 w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-emerald-400/50 text-sm"
          })
        );
      })
    );
  }

  function syncAges(ages, count) {
    var next = ages.slice(0, count);
    while (next.length < count) next.push("");
    return next;
  }

  // ---------------------------------------------------------------------
  // Root App
  // ---------------------------------------------------------------------
  function App() {
    var pageState = useState(1); var page = pageState[0], setPage = pageState[1];
    var pkgState = useState(null); var pkg = pkgState[0], setPkg = pkgState[1];
    var menuState = useState(false); var mobileMenuOpen = menuState[0], setMobileMenuOpen = menuState[1];
    var galleryState = useState("All"); var galleryFilter = galleryState[0], setGalleryFilter = galleryState[1];

    var contactState = useState({ name: "", whatsapp: "", date: "" });
    var contact = contactState[0], setContact = contactState[1];

    var sharedTourState = useState({ adults: 2, children: 0, childAges: [], lunchQty: {} });
    var sharedTourForm = sharedTourState[0], setSharedTourForm = sharedTourState[1];

    var campingState = useState({ adults: 2, children: 0, childAges: [], tents: 1, meals: "no", jeep: "no", activities: "no", foodQty: {} });
    var campingForm = campingState[0], setCampingForm = campingState[1];

    var privateState = useState({ people: 1, jeep: "no", adventure: "yes", lunchQty: {}, camping: "no", tents: 1, campingMeals: "yes", bambooQty: {} });
    var privateForm = privateState[0], setPrivateForm = privateState[1];

    // Minimum advance is read from PRICES.minAdvance (admin-editable) so
    // it stays in sync everywhere it's shown or enforced — falls back to
    // 500 if an older/incomplete PRICES object doesn't define it.
    var minAdvance = PRICES.minAdvance || 500;
    var advanceState = useState(minAdvance); var advance = advanceState[0], setAdvance = advanceState[1];
    var payTabState = useState("qr"); var payTab = payTabState[0], setPayTab = payTabState[1];
    var copiedState = useState(""); var copied = copiedState[0], setCopied = copiedState[1];

    // ---- WhatsApp booking submission (no backend — submitting a booking
    // just opens WhatsApp with everything prefilled) ----------------------
    // bookingCode here is the visitor reference code (0001, 0002, 0003…),
    // assigned from the local visitor counter — see visitorCodeRef below.
    var bookingCodeState = useState(""); var bookingCode = bookingCodeState[0], setBookingCode = bookingCodeState[1];
    var submitErrorState = useState(""); var submitError = submitErrorState[0], setSubmitError = submitErrorState[1];
    // Whether the visitor has tapped Submit and been handed off to WhatsApp.
    var submittedState = useState(false); var submitted = submittedState[0], setSubmitted = submittedState[1];

    // PRICES (declared near the top of this file) is a plain mutable object,
    // not React state — mutating its fields via Object.assign doesn't by
    // itself trigger a re-render. priceVersion exists purely to force one:
    // bump it whenever the admin dashboard's saved prices differ from what's
    // currently loaded, so every price shown on screen (calculator totals,
    // per-item price tags, etc.) picks up the change without needing a
    // page reload.
    var priceVersionState = useState(0); var priceVersion = priceVersionState[0], setPriceVersion = priceVersionState[1];

    // ---- Visitor reference code (0001, 0002, 0003…) ----------------------
    // A simple running counter saved in this browser's localStorage,
    // incremented once per visit. Used as the reference code included in
    // every prefilled WhatsApp message. It's per-device (there's no server
    // to share a single count across every visitor's browser) — the admin
    // dashboard's Visitors tab reads the same counter.
    var VISITOR_SEQ_KEY = "kc_visitor_seq";
    var visitorCodeRef = React.useRef(null);
    if (!visitorCodeRef.current) {
      var nextSeq = 1;
      try {
        nextSeq = (parseInt(localStorage.getItem(VISITOR_SEQ_KEY), 10) || 0) + 1;
        localStorage.setItem(VISITOR_SEQ_KEY, String(nextSeq));
      } catch (e) { /* localStorage unavailable — fall back to 1 for this visit */ }
      visitorCodeRef.current = String(nextSeq).padStart(4, "0");
    }

    // ---- Live prices/content from the Admin Dashboard (localStorage) ----
    // admin.html saves whatever the admin edits into localStorage under
    // these keys. Read them on load, and also on every "storage" event so
    // a change saved on the Admin Dashboard in another tab of the SAME
    // browser applies here immediately without a reload. This only syncs
    // within one device/browser — there's no server to broadcast it wider.
    var PRICES_KEY = "kc_admin_prices";
    var CONTENT_KEY = "kc_admin_content";
    function applyStoredOverrides() {
      var changed = false;
      try {
        var storedPrices = JSON.parse(localStorage.getItem(PRICES_KEY) || "null");
        if (storedPrices) { Object.assign(PRICES, storedPrices); changed = true; }
      } catch (e) { /* ignore malformed data */ }
      try {
        var storedContent = JSON.parse(localStorage.getItem(CONTENT_KEY) || "null");
        if (storedContent) {
          Object.assign(CONTENT, storedContent);
          if (storedContent.bank) Object.assign(CONTENT.bank, storedContent.bank);
          changed = true;
        }
      } catch (e) { /* ignore malformed data */ }
      if (changed) setPriceVersion(function (v) { return v + 1; }); // force re-render so new numbers/content actually show
    }
    useEffect(function () {
      applyStoredOverrides();
      function onStorage(e) {
        if (e.key === PRICES_KEY || e.key === CONTENT_KEY) applyStoredOverrides();
      }
      window.addEventListener("storage", onStorage);
      return function () { window.removeEventListener("storage", onStorage); };
    }, []);

    // Builds the prefilled WhatsApp message from the selected package +
    // items + contact details, opens it in a new tab/app, and moves the
    // visitor on to the confirmation page. No server round-trip — WhatsApp
    // *is* the submission.
    function submitBookingViaWhatsApp() {
      if (!pkg) { setSubmitError("Please choose a package before submitting."); return false; }
      if (!contact.name || !contact.whatsapp || !contact.date) { setSubmitError("Please fill in your name, WhatsApp number, and date first."); return false; }
      setSubmitError("");
      setBookingCode(visitorCodeRef.current);
      setSubmitted(true);
      saveBookingRecord(visitorCodeRef.current);
      window.open(whatsappLink(), "_blank");
      setPage(6);
      return true;
    }

    // ---- Booking record, saved for the Super Admin dashboard -------------
    // No backend — bookings are written to this browser's localStorage under
    // BOOKINGS_KEY as a simple array. Same per-device limitation as prices
    // and the visitor counter: admin.html reads this list on the SAME
    // device/browser the booking was made on. Each record starts with
    // status "pending"; the admin can update status/edit/delete/export from
    // the Bookings tab in admin.html.
    var BOOKINGS_KEY = "kc_bookings";
    function saveBookingRecord(code) {
      try {
        var list = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || "[]");
        list.push({
          code: code,
          createdAt: new Date().toISOString(),
          status: "pending",
          name: contact.name,
          whatsapp: contact.whatsapp,
          date: contact.date,
          package: packageLabel,
          people:
            pkg === "sharedTour" ? (totals.payingPersons || 0) + (totals.freeChildren || 0) :
            pkg === "camping" ? totals.payingHeads :
            pkg === "privatePackage" ? totals.people :
            null,
          total: grandTotal,
          advance: advance,
          balance: balanceLeft
        });
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list));
      } catch (e) { console.error("Couldn't save booking record:", e); }
    }

    var packageLabel = pkg === "sharedTour" ? (CONTENT.packages.sharedTour && CONTENT.packages.sharedTour.name) || "Shared Package"
      : pkg === "camping" ? (CONTENT.packages.camping && CONTENT.packages.camping.name) || "Camping Package"
      : pkg === "privatePackage" ? (CONTENT.packages.privatePackage && CONTENT.packages.privatePackage.name) || "Private Package"
      : "";

    var totals = useMemo(function () {
      if (pkg === "sharedTour") return sharedTourTotals(sharedTourForm);
      if (pkg === "camping") return campingTotals(campingForm);
      if (pkg === "privatePackage") return privatePackageTotals(privateForm);
      return { grandTotal: 0 };
    }, [pkg, sharedTourForm, campingForm, privateForm]);

    var grandTotal = totals.grandTotal || 0;
    var balanceLeft = Math.max(0, grandTotal - Number(advance || 0));

    function copyToClipboard(text, key) {
      navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(function () { setCopied(""); }, 1500);
    }

    function goToPackage(which) {
      setPkg(which);
      setPage(3);
    }

    function invoiceLines() {
      if (pkg === "sharedTour") {
        var stLines = [
          ["Adults", totals.adults],
          ["Children (Free)", totals.freeChildren],
          ["Paying Persons", totals.payingPersons],
          ["Price Per Person", money(totals.pricePerPerson)]
        ];
        (totals.lunchLines || []).forEach(function (l) { if (l.qty > 0) stLines.push([l.name + " x" + l.qty, money(l.cost)]); });
        if (totals.childFeeCost > 0) stLines.push(["Life Jacket & Entry Fee (" + totals.freeChildren + " free child" + (totals.freeChildren === 1 ? "" : "ren") + ")", money(totals.childFeeCost)]);
        return stLines;
      }
      if (pkg === "camping") {
        var lines = [];
        if (totals.tentsSelected > 0) lines.push(["Tent" + (totals.tentsSelected === 1 ? "" : "s") + " x" + totals.tentsSelected, money(totals.tentCost)]);
        lines.push(["Overnight Guide (mandatory)", money(totals.guideCost)]);
        if (totals.mealsCost > 0) lines.push(["Meals (" + totals.payingHeads + " people)", money(totals.mealsCost)]);
        if (totals.jeepCost > 0) lines.push(["4x4 Jeep (Pickup & Drop)", money(totals.jeepCost)]);
        if (totals.activitiesCost > 0) lines.push(["Adventure Activities (" + totals.payingHeads + " people)", money(totals.activitiesCost)]);
        if (totals.childFeeCost > 0) lines.push(["Life Jacket & Entry Fee (free children)", money(totals.childFeeCost)]);
        totals.foodLines.forEach(function (l) { if (l.qty > 0) lines.push([l.name + " x" + l.qty, money(l.cost)]); });
        return lines;
      }
      if (pkg === "privatePackage") {
        var ppLines = [];
        if (totals.jeepCost > 0) ppLines.push(["4x4 Jeep", money(totals.jeepCost)]);
        ppLines.push(
          totals.campingOn
            ? ["Local Guide (waived — covered by Overnight Guide)", "₹0"]
            : ["Local Guide (mandatory)", money(totals.guideCost)]
        );
        if (totals.activitiesCost > 0) ppLines.push(["Adventure Activities (" + totals.people + " people)", money(totals.activitiesCost)]);
        totals.lunchLines.forEach(function (l) { if (l.qty > 0) ppLines.push([l.name + " x" + l.qty, money(l.cost)]); });
        if (totals.campingOn) {
          ppLines.push(["Camping Tent Rental", money(totals.tentCost)]);
          if (totals.campingMealsCost > 0) ppLines.push(["Camping Meals", money(totals.campingMealsCost)]);
          ppLines.push(["Overnight Guide (mandatory)", money(totals.overnightGuideCost)]);
          totals.bambooLines.forEach(function (l) { if (l.qty > 0) ppLines.push([l.name + " x" + l.qty, money(l.cost)]); });
        }
        return ppLines;
      }
      if (pkg === "guideOnly") {
        return [["Package Name", "Guide Only"], ["Price", money(totals.price)]];
      }
      return [];
    }

    function whatsappLink() {
      var lines = invoiceLines().map(function (l) { return l[0] + ": " + l[1]; }).join("\n");
      var msg = "Hello Krem Chympe Adventure!\nRef: #" + visitorCodeRef.current +
        "\nName: " + contact.name + "\nWhatsApp: " + contact.whatsapp +
        "\nDate: " + contact.date + "\nPackage: " + packageLabel + "\n" + lines +
        "\nGrand Total: " + money(grandTotal) + "\nIntended Advance: " + money(advance) + "\nBalance Left: " + money(balanceLeft) +
        "\nPreferred Payment Method: " + (payTab === "qr" ? "QR Code" : payTab === "upi" ? "UPI" : "Bank Transfer");
      return "https://wa.me/" + CONTENT.whatsappNumber + "?text=" + encodeURIComponent(msg);
    }

    // ---- Header ----------------------------------------------------
    var header = h(
      "header", { className: "sticky top-0 z-40 p-3 md:p-4" },
      h(
        GlassCard, { className: "max-w-[1280px] mx-auto px-4 md:px-6 py-3 flex items-center justify-between" },
        h(
          "div", { className: "flex items-center gap-3" },
          CONTENT.logoImage
            ? h("img", { src: CONTENT.logoImage, className: "w-9 h-9 rounded-full object-cover border border-white/20" })
            : h("div", { className: "w-9 h-9 rounded-full bg-[#2E8B57] flex items-center justify-center" }, h(Mountain, { size: 18 })),
          h(
            "div", { className: "leading-tight" },
            h("div", { className: "font-bold tracking-[0.12em] text-[13px]" }, CONTENT.siteName),
            h("div", { className: "text-[10px] tracking-[0.18em] text-white/70 -mt-0.5" }, CONTENT.siteSub)
          )
        ),
        h(
          "nav", { className: "hidden md:flex items-center gap-1 bg-white/[0.06] border border-white/10 rounded-full p-1.5 backdrop-blur-xl" },
          (CONTENT.nav && CONTENT.nav.items || ["Home", "Explore", "Packages", "Gallery", "Booking", "Contact"]).map(function (p, i) {
            return h("button", {
              key: p,
              onClick: function () { setPage(p === "Home" ? 1 : 2); },
              className: "px-4 py-1.5 rounded-full text-[13px] transition " + (i === 0 && page === 1 ? "bg-white text-black" : "text-white/80 hover:text-white hover:bg-white/10")
            }, p);
          })
        ),
        h(
          "div", { className: "flex items-center gap-2" },
          h("button", { onClick: function () { setPage(2); }, className: "hidden md:block bg-[#2E8B57] hover:bg-[#257a4b] px-5 py-2 rounded-full text-sm font-medium transition" }, t("bookNow", "Book Now")),
          h("button", { onClick: function () { setMobileMenuOpen(!mobileMenuOpen); }, className: "md:hidden w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center" }, mobileMenuOpen ? h(X, { size: 18 }) : h(Menu, { size: 18 }))
        )
      ),
      mobileMenuOpen && h(
        GlassCard, { className: "md:hidden mt-3 p-4 max-w-[1280px] mx-auto space-y-2" },
        (CONTENT.nav && CONTENT.nav.mobileItems || ["Home", "Packages", "Gallery"]).map(function (p) {
          return h("button", {
            key: p,
            onClick: function () { setPage(p === "Home" ? 1 : 2); setMobileMenuOpen(false); },
            className: "w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10"
          }, p);
        }),
        h("button", { onClick: function () { setPage(2); setMobileMenuOpen(false); }, className: "w-full bg-[#2E8B57] py-3 rounded-full font-medium" }, t("bookNow", "Book Now")),
        h("a", { href: "admin.html", className: "block text-center text-[11px] text-white/30 pt-1" }, "Admin")
      )
    );

    // ---- Page 1: Home ------------------------------------------------
    var titleWords = CONTENT.hero.title.split(" ");
    var page1 = page === 1 && h(
      "main", { className: "max-w-[1280px] mx-auto px-4 md:px-6 pb-32 space-y-6" },
      h(
        "div", { className: "grid md:grid-cols-[1.15fr_0.85fr] gap-6" },
        h(
          GlassCard, { className: "p-8 md:p-12" },
          h("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] tracking-widest" }, CONTENT.hero.badge),
          h(
            "h1", { className: "mt-6 text-[32px] md:text-[56px] font-bold leading-[0.95] tracking-tight" },
            titleWords.slice(0, 2).join(" "), h("br"), h("span", { className: "text-white/70" }, titleWords.slice(2).join(" "))
          ),
          h("p", { className: "mt-5 text-white/70 text-[15px] leading-relaxed max-w-[520px]" }, CONTENT.hero.sub),
          h("div", { className: "mt-8 flex gap-3" }, h("button", { onClick: function () { setPage(2); }, className: "bg-[#2E8B57] hover:bg-[#257a4b] px-7 py-3 rounded-full text-sm font-semibold flex items-center gap-2" }, "Book Now ", h(ArrowRight, { size: 16 })))
        ),
        h(
          GlassCard, { className: "p-5 md:p-6 flex flex-col justify-between" },
          h(
            "div", { className: "space-y-4" },
            h("div", { className: "flex items-center justify-between" }, h("span", { className: "text-sm text-white/70 flex items-center gap-2" }, h(Users, { size: 16 }), t("visitors", " Visitors")), h("span", { className: "text-sm font-medium" }, t("visitorRange", "1 - 5 People"))),
            h("div", { className: "h-px bg-white/10" }),
            h("div", { className: "flex items-center justify-between" }, h("span", { className: "text-sm text-white/70 flex items-center gap-2" }, h(Clock, { size: 16 }), t("duration", " Duration")), h("span", { className: "text-sm font-medium" }, CONTENT.hero.duration)),
            h("div", { className: "h-px bg-white/10" }),
            h("div", { className: "flex items-center justify-between" }, h("span", { className: "text-sm text-white/70 flex items-center gap-2" }, h(IndianRupee, { size: 16 }), t("price", " Price")), h("span", { className: "text-sm font-medium" }, CONTENT.hero.priceLabel)),
            h("div", { className: "mt-6 rounded-[16px] overflow-hidden border border-white/10" }, h("img", { src: CONTENT.sectionImages.heroCave, className: "w-full h-[180px] object-cover" }))
          ),
          h("button", { onClick: function () { setPage(2); }, className: "mt-6 w-full bg-[#2E8B57] hover:bg-[#257a4b] py-3 rounded-full text-sm font-semibold" }, t("bookNow", "Book Now"))
        )
      ),
      SECTIONS.trustBar && h(
        GlassCard, { className: "px-6 py-4 flex flex-wrap items-center justify-between gap-4" },
        h(
          "div", { className: "flex items-center gap-3" },
          h("div", { className: "flex -space-x-2" }, [0, 1, 2, 3].map(function (p) { return h("img", { key: p, src: "https://i.pravatar.cc/100?img=" + (10 + p), className: "w-8 h-8 rounded-full border-2 border-black/30" }); })),
          h("div", { className: "text-[13px]" }, h("span", { className: "font-semibold" }, TRUST.trustedText), " ", h("span", { className: "text-white/60" }, TRUST.travelersText))
        ),
        h(
          "div", { className: "flex gap-6 text-[13px]" },
          h("span", { className: "flex items-center gap-2" }, h(Star, { size: 14, className: "text-amber-400" }), " " + TRUST.googleRatingText),
          h("span", { className: "flex items-center gap-2" }, h(Shield, { size: 14, className: "text-emerald-400" }), " " + TRUST.safetyCertifiedText),
          h("span", { className: "flex items-center gap-2" }, h(Award, { size: 14 }), " " + TRUST.ecoTourismText)
        )
      ),
      (SECTIONS.ourStory || SECTIONS.statsRow || SECTIONS.meetGuide) && h(
        "div", { className: "grid md:grid-cols-[1.1fr_0.9fr] gap-6" },
        SECTIONS.ourStory && h(
          GlassCard, { className: "p-8 md:p-10" },
          h("h2", { className: "text-2xl font-semibold" }, t("ourStory", "Our Story")),
          h(
            "div", { className: "mt-8 space-y-6 border-l border-white/10 pl-6 relative" },
            STORY_TIMELINE.map(function (p) {
              return h(
                "div", { key: p.title, className: "relative" },
                h("div", { className: "absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-[#2E8B57] border-2 border-white/20" }),
                h("div", { className: "text-[11px] tracking-widest text-white/50" }, p.year),
                h("div", { className: "font-medium mt-1" }, p.title),
                h("div", { className: "text-[13px] text-white/60 mt-1" }, p.desc)
              );
            })
          )
        ),
        (SECTIONS.statsRow || SECTIONS.meetGuide) && h(
          "div", { className: "space-y-6" },
          SECTIONS.statsRow && h(
            GlassCard, { className: "p-6 grid grid-cols-2 gap-4" },
            [
              { k: "12KM", v: t("statForestTrailLabel", "Forest Trail") },
              { k: "2 Hour", v: t("statAverageTrekLabel", "Average Trek") },
              { k: "100+", v: t("statSpeciesLabel", "Species") },
              { k: "4.9", v: t("statGoogleRatingLabel", "Google Rating") }
            ].map(function (p) {
              return h("div", { key: p.v, className: "rounded-[16px] bg-white/5 border border-white/10 p-5" }, h("div", { className: "text-2xl font-bold" }, p.k), h("div", { className: "text-[12px] text-white/60 mt-1" }, p.v));
            })
          ),
          SECTIONS.meetGuide && h(
            GlassCard, { className: "p-6 flex gap-4 items-center" },
            h("img", { src: CONTENT.guide.image, className: "w-16 h-16 rounded-full object-cover border border-white/20" }),
            h(
              "div", null,
              h("div", { className: "font-semibold" }, t("meetYourGuide", "Meet Your Guide")),
              h("div", { className: "text-[13px] text-white/80" }, CONTENT.guide.name, " • ", CONTENT.guide.role),
              h("div", { className: "text-[12px] text-white/60 mt-1 max-w-[280px]" }, CONTENT.guide.bio)
            )
          )
        )
      )
    );

    // ---- Package cards -------------------------------------------------
    function IncludedItem(text) {
      return h("li", { key: text, className: "flex gap-2" }, h(Check, { size: 14, className: "text-emerald-400 mt-0.5" }), " " + text);
    }

    var PKG = CONTENT.packages || {};
    var pkgFillValues = { childFreeAge: PRICES.childFreeAge, mealsPerPerson: money(PRICES.camping.mealsPerPerson), overnightGuide: money(PRICES.camping.overnightGuide), childJacketFee: money(PRICES.childJacketFee), childEntryFee: money(PRICES.childEntryFee) };
    var PACKAGES_PAGE = CONTENT.packagesPage || { subtitle: "", trustRow: [] };
    var GALLERY_PAGE = CONTENT.galleryPage || { subtitle: "", filters: ["All"], viewAllLabel: "" };

    var sharedTourCard = SECTIONS.sharedTourCard && h(
      GlassCard, { className: "overflow-hidden group" },
      h(
        "div", { className: "relative h-[220px] overflow-hidden" },
        h("img", { src: CONTENT.sectionImages.sharedPackageCard, className: "w-full h-full object-cover group-hover:scale-105 transition duration-700" }),
        h("div", { className: "absolute top-4 left-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur text-xs border border-white/10" }, PKG.sharedTour.badge),
        h("div", { className: "absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/70 to-transparent" })
      ),
      h(
        "div", { className: "p-6" },
        h(
          "div", { className: "flex justify-between items-start" },
          h("h3", { className: "text-xl font-semibold" }, PKG.sharedTour.name),
          h("div", { className: "text-right" }, h("div", { className: "text-xl font-bold" }, money(PRICES.sharedTour.perPerson)), h("div", { className: "text-[11px] text-white/50" }, PKG.sharedTour.priceUnit))
        ),
        h(
          "ul", { className: "mt-4 space-y-2 text-[13px] text-white/70" },
          PKG.sharedTour.features.map(function (f) { return IncludedItem(fill(f, pkgFillValues)); })
        ),
        h("button", { onClick: function () { goToPackage("sharedTour"); }, className: "mt-6 w-full bg-[#2E8B57] hover:bg-[#257a4b] py-3 rounded-full font-medium flex items-center justify-center gap-2" }, t("bookNow", "Book Now"), " ", h(ArrowRight, { size: 16 }))
      )
    );

    var campingCard = SECTIONS.campingCard && h(
      GlassCard, { className: "overflow-hidden group" },
      h(
        "div", { className: "relative h-[220px] overflow-hidden" },
        h("img", { src: CONTENT.sectionImages.campingCard, className: "w-full h-full object-cover group-hover:scale-105 transition duration-700" }),
        h("div", { className: "absolute top-4 left-4 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs border border-white/10 flex items-center gap-1" }, h(Tent, { size: 12 }), " " + PKG.camping.badge),
        h("div", { className: "absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/70 to-transparent" })
      ),
      h(
        "div", { className: "p-6" },
        h(
          "div", { className: "flex justify-between items-start" },
          h("h3", { className: "text-xl font-semibold" }, PKG.camping.name),
          h("div", { className: "text-right" }, h("div", { className: "text-xl font-bold" }, money(PRICES.camping.tent)), h("div", { className: "text-[11px] text-white/50" }, PKG.camping.priceUnit))
        ),
        h(
          "ul", { className: "mt-4 space-y-2 text-[13px] text-white/70" },
          PKG.camping.features.map(function (f) { return IncludedItem(fill(f, pkgFillValues)); })
        ),
        h("button", { onClick: function () { goToPackage("camping"); }, className: "mt-6 w-full bg-white text-black hover:bg-white/90 py-3 rounded-full font-medium flex items-center justify-center gap-2" }, t("bookNow", "Book Now"), " ", h(ArrowRight, { size: 16 }))
      )
    );

    var guideOnlyCard = false; // Guide Only package removed — kept as `false` so any
    // stray reference elsewhere renders nothing instead of throwing.

    var PPB = CONTENT.privatePackageBooking || {};
    var privatePackageCard = SECTIONS.privatePackageCard && h(
      GlassCard, { className: "overflow-hidden group" },
      h(
        "div", { className: "relative h-[220px] overflow-hidden" },
        h("img", { src: CONTENT.sectionImages.privatePackageCard, className: "w-full h-full object-cover group-hover:scale-105 transition duration-700" }),
        h("div", { className: "absolute top-4 left-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur text-xs border border-white/10" }, PKG.privatePackage.badge),
        h("div", { className: "absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/70 to-transparent" })
      ),
      h(
        "div", { className: "p-6" },
        h(
          "div", { className: "flex justify-between items-start" },
          h("h3", { className: "text-xl font-semibold" }, PKG.privatePackage.name),
          h("div", { className: "text-right" }, h("div", { className: "text-[11px] text-white/50" }, PKG.privatePackage.priceUnit))
        ),
        h(
          "ul", { className: "mt-4 space-y-2 text-[13px] text-white/70" },
          PKG.privatePackage.features.map(function (f) { return IncludedItem(f); })
        ),
        h("button", { onClick: function () { goToPackage("privatePackage"); }, className: "mt-6 w-full bg-[#2E8B57] hover:bg-[#257a4b] py-3 rounded-full font-medium flex items-center justify-center gap-2" }, t("bookNow", "Book Now"), " ", h(ArrowRight, { size: 16 }))
      )
    );

    // ---- Page 2: Packages & Gallery ------------------------------------
    var page2 = page === 2 && h(
      "main", { className: "max-w-[1280px] mx-auto px-4 md:px-6 pb-32 space-y-6" },
      h(
        GlassCard, { className: "p-8 md:p-10 text-center" },
        h("h2", { className: "text-3xl md:text-4xl font-bold" }, t("ourAdventurePackages", "Our Adventure Packages")),
        h("p", { className: "text-white/60 mt-3 text-sm" }, PACKAGES_PAGE.subtitle)
      ),
      h("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6" }, sharedTourCard, campingCard, privatePackageCard),
      SECTIONS.packagesTrustRow && h(
        GlassCard, { className: "px-6 py-4 flex flex-wrap justify-center gap-6 text-[13px] text-white/70" },
        PACKAGES_PAGE.trustRow.map(function (label, i) {
          var icons = [Shield, Users, Leaf, Star];
          var Icon = icons[i] || Shield;
          return h("span", { key: label, className: "flex items-center gap-2" }, h(Icon, { size: 14 }), " " + label);
        })
      ),
      SECTIONS.gallery && h(
        GlassCard, { className: "p-6 md:p-8" },
        h(
          "div", { className: "flex flex-wrap justify-between items-center gap-4" },
          h("h3", { className: "text-2xl font-semibold" }, t("ourGallery", "Our Gallery"), h("br"), h("span", { className: "text-white/50 text-base font-normal" }, GALLERY_PAGE.subtitle)),
          h("div", { className: "flex gap-2 flex-wrap" }, GALLERY_PAGE.filters.map(function (p) {
            return h("button", { key: p, onClick: function () { setGalleryFilter(p); }, className: "px-4 py-1.5 rounded-full text-xs border transition " + (galleryFilter === p ? "bg-white text-black border-white" : "bg-white/5 border-white/10 hover:bg-white/10") }, p);
          }))
        ),
        h("div", { className: "mt-6 grid grid-cols-12 gap-3 auto-rows-[140px]" }, CONTENT.galleryImages.filter(function (p) { return galleryFilter === "All" || p.cat === galleryFilter; }).map(function (p) {
          return h(
            "div", { key: p.id, className: p.span + " rounded-[16px] overflow-hidden border border-white/10 relative group" },
            h("img", { src: p.src, className: "w-full h-full object-cover group-hover:scale-110 transition duration-700" }),
            h("div", { className: "absolute inset-0 bg-black/10 group-hover:bg-black/0 transition" }),
            h("div", { className: "absolute bottom-2 left-2 px-2 py-1 rounded-full bg-black/50 backdrop-blur text-[10px] border border-white/10" }, p.cat)
          );
        })),
        h("div", { className: "mt-6 flex justify-center" }, h("a", { href: CONTENT.instagram, target: "_blank", className: "px-6 py-2.5 rounded-full bg-white/10 border border-white/10 hover:bg-white/15 text-sm flex items-center gap-2" }, h(Camera, { size: 16 }), GALLERY_PAGE.viewAllLabel))
      )
    );

    // ---- Page 3: Booking form (varies by package) ----------------------
    var contactFields = h(
      "div", { className: "grid md:grid-cols-2 gap-5" },
      h("label", { className: "space-y-2 block" }, h("span", { className: "text-xs text-white/60" }, t("fullName", "Full Name")), h("input", { value: contact.name, onChange: function (e) { setContact(Object.assign({}, contact, { name: e.target.value })); }, placeholder: "Your name", className: "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-emerald-400/50 text-sm" })),
      h("label", { className: "space-y-2 block" }, h("span", { className: "text-xs text-white/60" }, t("whatsappNumberLabel", "WhatsApp Number")), h("input", { value: contact.whatsapp, onChange: function (e) { setContact(Object.assign({}, contact, { whatsapp: e.target.value })); }, placeholder: "+91 98765 43210", className: "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-emerald-400/50 text-sm" })),
      h("label", { className: "space-y-2 block md:col-span-2" }, h("span", { className: "text-xs text-white/60" }, t("dateLabel", "Date")), h("input", { type: "date", value: contact.date, onChange: function (e) { setContact(Object.assign({}, contact, { date: e.target.value })); }, className: "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none text-sm [color-scheme:dark]" }))
    );

    var STB = CONTENT.sharedTourBooking || {};
    var sharedTourForm2 = pkg === "sharedTour" && h(
      "div", { className: "mt-8 space-y-5" },
      h(
        GlassCard, { className: "p-5 !rounded-[16px] text-[13px] text-white/70" },
        h("div", { className: "font-medium text-white mb-2" }, STB.includedTitle),
        h("div", { className: "text-white/70" }, STB.includesLabel || "Includes:"),
        h("ul", { className: "mt-1 text-xs text-white/50 list-disc pl-5 space-y-0.5" }, (STB.includedItems || []).map(function (it) { return h("li", { key: it }, it); })),
        h("div", { className: "mt-3 text-white/50" }, fill(STB.childFreeText, pkgFillValues)),
        toLines(STB.batchText).map(function (line, i) { return h("div", { key: i, className: "mt-2 text-white/50" }, fill(line, pkgFillValues)); })
      ),
      h(
        "div", { className: "grid md:grid-cols-2 gap-5" },
        h("label", { className: "space-y-2 block" }, h("span", { className: "text-xs text-white/60" }, STB.adultsLabel), h("div", { className: "flex items-center justify-between px-4 py-2 rounded-xl bg-white/5 border border-white/10" }, h("span", { className: "text-sm" }, sharedTourForm.adults, " " + STB.adultsLabel), h(Stepper, { value: sharedTourForm.adults, min: 1, onChange: function (v) { setSharedTourForm(Object.assign({}, sharedTourForm, { adults: v })); } }))),
        h("label", { className: "space-y-2 block" }, h("span", { className: "text-xs text-white/60" }, STB.childrenLabel), h("div", { className: "flex items-center justify-between px-4 py-2 rounded-xl bg-white/5 border border-white/10" }, h("span", { className: "text-sm" }, sharedTourForm.children, " " + STB.childrenLabel), h(Stepper, { value: sharedTourForm.children, onChange: function (v) { setSharedTourForm(Object.assign({}, sharedTourForm, { children: v, childAges: syncAges(sharedTourForm.childAges, v) })); } })))
      ),
      h(ChildAgesInput, { count: sharedTourForm.children, ages: sharedTourForm.childAges, onChange: function (ages) { setSharedTourForm(Object.assign({}, sharedTourForm, { childAges: ages })); } }),
      h(
        GlassCard, { className: "p-5 !rounded-[16px] space-y-3" },
        h("div", { className: "flex justify-between items-baseline" }, h("div", { className: "font-medium" }, STB.lunchTitle), h("div", { className: "text-xs text-white/50" }, money(PRICES.sharedTour.lunchThaliPrice) + STB.lunchPriceUnit)),
        h("div", { className: "text-xs text-white/50" }, STB.lunchSubtitle),
        toLines(STB.lunchIncludes).map(function (line, i) { return h("div", { key: i, className: "text-xs text-white/50" }, line); }),
        h("div", { className: "space-y-2" }, (PRICES.sharedTour.thaliTypes || []).map(function (th) {
          var qty = (sharedTourForm.lunchQty || {})[th.id] || 0;
          return h(ThaliRow, {
            key: th.id, name: th.name, price: PRICES.sharedTour.lunchThaliPrice, qty: qty,
            onChange: function (v) { var next = Object.assign({}, sharedTourForm.lunchQty); next[th.id] = v; setSharedTourForm(Object.assign({}, sharedTourForm, { lunchQty: next })); }
          });
        }))
      )
    );

    var CB = CONTENT.campingBooking || {};
    var campingForm2 = pkg === "camping" && h(
      "div", { className: "mt-8 space-y-5" },
      h(
        "div", { className: "grid md:grid-cols-2 gap-5" },
        h("label", { className: "space-y-2 block" }, h("span", { className: "text-xs text-white/60" }, CB.adultsLabel), h("div", { className: "flex items-center justify-between px-4 py-2 rounded-xl bg-white/5 border border-white/10" }, h("span", { className: "text-sm" }, campingForm.adults, " " + CB.adultsLabel), h(Stepper, { value: campingForm.adults, min: 1, onChange: function (v) { setCampingForm(Object.assign({}, campingForm, { adults: v })); } }))),
        h("label", { className: "space-y-2 block" }, h("span", { className: "text-xs text-white/60" }, CB.childrenLabel), h("div", { className: "flex items-center justify-between px-4 py-2 rounded-xl bg-white/5 border border-white/10" }, h("span", { className: "text-sm" }, campingForm.children, " " + CB.childrenLabel), h(Stepper, { value: campingForm.children, onChange: function (v) { setCampingForm(Object.assign({}, campingForm, { children: v, childAges: syncAges(campingForm.childAges, v) })); } })))
      ),
      h(ChildAgesInput, { count: campingForm.children, ages: campingForm.childAges, onChange: function (ages) { setCampingForm(Object.assign({}, campingForm, { childAges: ages })); } }),
      h(
        GlassCard, { className: "p-5 !rounded-[16px] text-[13px] text-white/70" },
        h("div", { className: "font-medium text-white mb-2" }, CB.packageIncludesTitle),
        h("div", { className: "text-white/70" }, CB.includesLabel || "Includes:"),
        h("ul", { className: "mt-1 text-xs text-white/50 list-disc pl-5 space-y-0.5" }, (CB.packageIncludesItems || []).map(function (it) { return h("li", { key: it }, it); }))
      ),
      h(
        GlassCard, { className: "p-5 !rounded-[16px] space-y-2" },
        h("div", { className: "flex justify-between items-baseline" }, h("div", { className: "font-medium" }, CB.tentLabel || "Tents"), h("div", { className: "text-xs text-white/50" }, money(PRICES.camping.tentUnit) + (CB.tentPriceUnit || "/tent"))),
        h("div", { className: "text-xs text-white/50" }, CB.tentNote),
        h("div", { className: "flex items-center justify-between px-4 py-2 rounded-xl bg-white/5 border border-white/10" },
          h("span", { className: "text-sm" }, campingForm.tents, " tent" + (campingForm.tents === 1 ? "" : "s")),
          h(Stepper, { value: campingForm.tents, min: 0, onChange: function (v) { setCampingForm(Object.assign({}, campingForm, { tents: v })); } })
        )
      ),
      h(
        "div", { className: "grid md:grid-cols-1 gap-5" },
        h(
          "div", { className: "space-y-2" },
          h("span", { className: "text-xs text-white/60" }, CB.mealsLabelPrefix + money(PRICES.camping.mealsPerPerson) + CB.mealsLabelSuffix),
          h("div", { className: "text-xs text-white/50" }, CB.mealsIncludes),
          h("div", { className: "text-xs text-white/50" }, CB.mealsNote),
          h(
            "div", { className: "flex gap-2" },
            h("button", { onClick: function () { setCampingForm(Object.assign({}, campingForm, { meals: "yes" })); }, className: "flex-1 px-4 py-2.5 rounded-xl border text-xs " + (campingForm.meals === "yes" ? "bg-white text-black border-white" : "bg-white/5 border-white/10") }, CB.mealsYes),
            h("button", { onClick: function () { setCampingForm(Object.assign({}, campingForm, { meals: "no" })); }, className: "flex-1 px-4 py-2.5 rounded-xl border text-xs " + (campingForm.meals === "no" ? "bg-white text-black border-white" : "bg-white/5 border-white/10") }, CB.mealsNo)
          )
        )
      ),
      h(
        GlassCard, { className: "p-5 !rounded-[16px] space-y-3" },
        h("div", { className: "flex justify-between items-baseline" }, h("div", { className: "font-medium" }, CB.guideTitle), h("div", { className: "text-xs text-white/50" }, money(PRICES.camping.overnightGuide))),
        h("div", { className: "text-xs text-white/50" }, fill(CB.guideNoteTemplate, { overnightGuide: money(PRICES.camping.overnightGuide), childFreeAge: PRICES.childFreeAge })),
        h(RadioRow, { selected: true, disabled: true, label: CB.guideMandatoryLabel })
      ),
      h(
        GlassCard, { className: "p-5 !rounded-[16px] space-y-3" },
        h("div", { className: "flex justify-between items-baseline" }, h("div", { className: "font-medium" }, CB.jeepTitle), h("div", { className: "text-xs text-white/50" }, money(PRICES.camping.jeep) + CB.jeepPriceUnit)),
        h("div", { className: "text-xs text-white/50" }, CB.jeepNote),
        h(
          "div", { className: "space-y-2" },
          h(RadioRow, { selected: campingForm.jeep === "yes", label: CB.jeepYesLabel, priceLabel: "(+" + money(PRICES.camping.jeep) + ")", onClick: function () { setCampingForm(Object.assign({}, campingForm, { jeep: "yes" })); } }),
          h(RadioRow, { selected: campingForm.jeep === "no", label: CB.jeepNoLabel, onClick: function () { setCampingForm(Object.assign({}, campingForm, { jeep: "no" })); } })
        )
      ),
      h(
        GlassCard, { className: "p-5 !rounded-[16px] space-y-3" },
        h("div", { className: "flex justify-between items-baseline" }, h("div", { className: "font-medium" }, CB.activitiesTitle), h("div", { className: "text-xs text-white/50" }, money(PRICES.camping.activitiesPerPerson) + CB.activitiesPriceUnit)),
        h("ul", { className: "text-xs text-white/50 list-disc pl-5 space-y-0.5" }, (CB.activitiesIncludes || []).map(function (it) { return h("li", { key: it }, it); })),
        h("div", { className: "text-xs text-white/50" }, CB.activitiesNote),
        h(
          "div", { className: "space-y-2" },
          h(RadioRow, { selected: campingForm.activities === "yes", label: CB.activitiesYesLabel, priceLabel: "(+" + money(PRICES.camping.activitiesPerPerson) + "/person)", onClick: function () { setCampingForm(Object.assign({}, campingForm, { activities: "yes" })); } }),
          h(RadioRow, { selected: campingForm.activities === "no", label: CB.activitiesNoLabel, onClick: function () { setCampingForm(Object.assign({}, campingForm, { activities: "no" })); } })
        )
      ),
      h(
        "details", { className: "group p-4 rounded-[16px] bg-white/5 border border-white/10", open: true },
        h("summary", { className: "flex justify-between items-center cursor-pointer list-none" }, h("span", { className: "text-sm font-medium flex items-center gap-2" }, h(Utensils, { size: 16 }), CB.bambooDishesTitle), h(ChevronDown, { size: 16, className: "group-open:rotate-180 transition" })),
        h("div", { className: "mt-4 grid md:grid-cols-2 gap-3" }, PRICES.bambooMenu.map(function (item) {
          var qty = campingForm.foodQty[item.id] || 0;
          return h(
            "div", { key: item.id, className: "flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 border border-white/10" },
            h("div", null, h("div", { className: "text-[13px]" }, item.name), h("div", { className: "text-xs text-white/50" }, money(item.price))),
            h(Stepper, { value: qty, onChange: function (v) { var nextQty = Object.assign({}, campingForm.foodQty); nextQty[item.id] = v; setCampingForm(Object.assign({}, campingForm, { foodQty: nextQty })); } })
          );
        }))
      )
    );

    // ---- Private Package booking form ------------------------------------
    function RadioRow(props) {
      // props: selected (bool), label, priceLabel, disabled, onClick
      return h(
        "button", {
          type: "button",
          disabled: props.disabled,
          onClick: props.onClick,
          className: "w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm " +
            (props.selected ? "bg-white/10 border-emerald-400/50" : "bg-white/5 border-white/10") +
            (props.disabled ? " opacity-70 cursor-default" : " hover:bg-white/10")
        },
        h("span", { className: "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 " + (props.selected ? "border-emerald-400" : "border-white/30") }, props.selected && h("span", { className: "w-2 h-2 rounded-full bg-emerald-400" })),
        h("span", null, props.label),
        props.priceLabel && h("span", { className: "text-white/50 text-xs" }, props.priceLabel)
      );
    }

    function ThaliRow(props) {
      // props: name, price, qty, onChange
      return h(
        "div", { className: "flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10" },
        h("div", null, h("div", { className: "text-sm" }, props.name), h("div", { className: "text-xs text-white/50" }, money(props.price) + (PPB.lunchEachSuffix || " each"))),
        h(Stepper, { value: props.qty, onChange: props.onChange }),
        h("div", { className: "w-14 text-right text-xs text-white/60" }, money(props.qty * props.price))
      );
    }

    var privatePackageForm2 = pkg === "privatePackage" && h(
      "div", { className: "mt-8 space-y-5" },

      // Number of people
      h(
        "label", { className: "space-y-2 block" },
        h("span", { className: "text-xs text-white/60" }, PPB.peopleLabel),
        h("div", { className: "flex items-center justify-between px-4 py-2 rounded-xl bg-white/5 border border-white/10" },
          h("span", { className: "text-sm" }, privateForm.people, " " + PPB.peopleLabel),
          h(Stepper, { value: privateForm.people, min: 1, onChange: function (v) { setPrivateForm(Object.assign({}, privateForm, { people: v })); } })
        )
      ),

      // 4x4 Jeep
      h(
        GlassCard, { className: "p-5 !rounded-[16px] space-y-3" },
        h("div", { className: "flex justify-between items-baseline" }, h("div", { className: "font-medium" }, PPB.jeepTitle), h("div", { className: "text-xs text-white/50" }, money(PRICES.privatePackage.jeep) + PPB.jeepPriceUnit)),
        h("div", { className: "text-xs text-white/50" }, PPB.jeepNote1),
        h("div", { className: "text-xs text-white/50" }, PPB.jeepNote2),
        h("div", { className: "space-y-2" },
          h(RadioRow, { selected: privateForm.jeep === "yes", label: PPB.jeepYesLabel, priceLabel: "(+" + money(PRICES.privatePackage.jeep) + ")", onClick: function () { setPrivateForm(Object.assign({}, privateForm, { jeep: "yes" })); } }),
          h(RadioRow, { selected: privateForm.jeep === "no", label: PPB.jeepNoLabel, onClick: function () { setPrivateForm(Object.assign({}, privateForm, { jeep: "no" })); } })
        )
      ),

      // Local Guide (mandatory)
      h(
        GlassCard, { className: "p-5 !rounded-[16px] space-y-3" },
        h("div", { className: "flex justify-between items-baseline" }, h("div", { className: "font-medium" }, PPB.guideTitle), h("div", { className: "text-xs text-white/50" }, money(PRICES.privatePackage.guide))),
        h("div", { className: "text-xs text-white/50" }, PPB.guideNote1),
        h("div", { className: "text-xs text-white/50" }, PPB.guideNote2),
        h(RadioRow, { selected: true, disabled: true, label: PPB.guideMandatoryLabel })
      ),

      // Adventure Activities
      h(
        GlassCard, { className: "p-5 !rounded-[16px] space-y-3" },
        h("div", { className: "flex justify-between items-baseline" }, h("div", { className: "font-medium" }, PPB.adventureTitle), h("div", { className: "text-xs text-white/50" }, money(PRICES.privatePackage.adventurePerPerson) + PPB.adventurePriceUnit)),
        h("div", { className: "text-xs text-white/50" }, PPB.adventureIncludesLabel),
        h("ul", { className: "text-xs text-white/50 list-disc pl-5 space-y-0.5" }, (PPB.adventureIncludes || []).map(function (it) { return h("li", { key: it }, it); })),
        h("div", { className: "text-xs text-white/50" }, PPB.adventureNote),
        h("div", { className: "space-y-2" },
          h(RadioRow, { selected: privateForm.adventure === "yes", label: PPB.adventureYesLabel, priceLabel: "(+" + money(PRICES.privatePackage.adventurePerPerson) + "/person)", onClick: function () { setPrivateForm(Object.assign({}, privateForm, { adventure: "yes" })); } }),
          h(RadioRow, { selected: privateForm.adventure === "no", label: PPB.adventureNoLabel, onClick: function () { setPrivateForm(Object.assign({}, privateForm, { adventure: "no" })); } })
        )
      ),

      // Lunch — thali quantities
      h(
        GlassCard, { className: "p-5 !rounded-[16px] space-y-3" },
        h("div", { className: "flex justify-between items-baseline" }, h("div", { className: "font-medium" }, PPB.lunchTitle), h("div", { className: "text-xs text-white/50" }, money(PRICES.privatePackage.lunchThaliPrice) + PPB.lunchPriceUnit)),
        h("div", { className: "text-xs text-white/50" }, PPB.lunchSubtitle),
        h("div", { className: "space-y-2" }, PRICES.privatePackage.thaliTypes.map(function (th) {
          var qty = (privateForm.lunchQty || {})[th.id] || 0;
          return h(ThaliRow, {
            key: th.id, name: th.name, price: PRICES.privatePackage.lunchThaliPrice, qty: qty,
            onChange: function (v) { var next = Object.assign({}, privateForm.lunchQty); next[th.id] = v; setPrivateForm(Object.assign({}, privateForm, { lunchQty: next })); }
          });
        }))
      ),

      // Camping toggle
      h(
        GlassCard, { className: "p-5 !rounded-[16px] space-y-3" },
        h("div", { className: "font-medium" }, PPB.campingTitle),
        h("div", { className: "space-y-2" },
          h(RadioRow, { selected: privateForm.camping === "yes", label: PPB.campingYesLabel, onClick: function () { setPrivateForm(Object.assign({}, privateForm, { camping: "yes" })); } }),
          h(RadioRow, { selected: privateForm.camping === "no", label: PPB.campingNoLabel, onClick: function () { setPrivateForm(Object.assign({}, privateForm, { camping: "no" })); } })
        )
      ),

      // Camping Details — only shown if Camping = yes; otherwise the form
      // goes straight from the toggle above to Next -> pricing -> payment.
      privateForm.camping === "yes" && h(
        "div", { className: "space-y-5" },
        h(
          GlassCard, { className: "!rounded-[16px] overflow-hidden" },
          h("div", { className: "px-5 py-3 bg-[#2E8B57]" }, h("div", { className: "font-semibold" }, PPB.campingDetailsTitle)),
          h("div", { className: "px-5 py-3 text-xs text-white/60" }, PPB.campingDetailsSubtitle)
        ),
        h(
          GlassCard, { className: "p-5 !rounded-[16px] space-y-3" },
          h("div", { className: "flex justify-between items-baseline" }, h("div", { className: "font-medium" }, PPB.tentTitle), h("div", { className: "text-xs text-white/50" }, money(PRICES.privatePackage.campingTent) + PPB.tentPriceUnit)),
          h("div", { className: "text-xs text-white/50" }, PPB.tentIncludes),
          h("div", { className: "text-xs text-white/50" }, PPB.tentNote),
          h("div", { className: "flex items-center justify-between px-4 py-2 rounded-xl bg-white/5 border border-white/10" },
            h("span", { className: "text-sm" }, PPB.tentsLabel),
            h(Stepper, { value: privateForm.tents, min: 0, onChange: function (v) { setPrivateForm(Object.assign({}, privateForm, { tents: v })); } })
          )
        ),
        h(
          GlassCard, { className: "p-5 !rounded-[16px] space-y-3" },
          h("div", { className: "flex justify-between items-baseline" }, h("div", { className: "font-medium" }, PPB.campingMealsTitle), h("div", { className: "text-xs text-white/50" }, money(PRICES.privatePackage.campingMealsPerPerson) + PPB.campingMealsPriceUnit)),
          h("div", { className: "text-xs text-white/50" }, PPB.campingMealsIncludes),
          h("div", { className: "text-xs text-white/50" }, PPB.campingMealsNote),
          h("div", { className: "space-y-2" },
            h(RadioRow, { selected: privateForm.campingMeals === "yes", label: PPB.campingMealsYesLabel, priceLabel: "(+" + money(PRICES.privatePackage.campingMealsPerPerson) + "/person)", onClick: function () { setPrivateForm(Object.assign({}, privateForm, { campingMeals: "yes" })); } }),
            h(RadioRow, { selected: privateForm.campingMeals === "no", label: PPB.campingMealsNoLabel, onClick: function () { setPrivateForm(Object.assign({}, privateForm, { campingMeals: "no" })); } })
          )
        ),
        h(
          GlassCard, { className: "p-5 !rounded-[16px] space-y-3" },
          h("div", { className: "flex justify-between items-baseline" }, h("div", { className: "font-medium" }, PPB.overnightGuideTitle), h("div", { className: "text-xs text-white/50" }, money(PRICES.privatePackage.overnightGuide))),
          h("div", { className: "text-xs text-white/50" }, PPB.overnightGuideNote),
          h(RadioRow, { selected: true, disabled: true, label: PPB.overnightGuideMandatoryLabel })
        ),
        h(
          "details", { className: "group p-4 rounded-[16px] bg-white/5 border border-white/10" },
          h("summary", { className: "flex justify-between items-center cursor-pointer list-none" }, h("div", null, h("span", { className: "text-sm font-medium flex items-center gap-2" }, h(Utensils, { size: 16 }), PPB.bambooDishesTitle), h("div", { className: "text-xs text-white/50 mt-1 font-normal" }, PPB.bambooDishesDesc)), h(ChevronDown, { size: 16, className: "group-open:rotate-180 transition flex-shrink-0" })),
          h("div", { className: "mt-4 grid md:grid-cols-2 gap-3" }, PRICES.bambooMenu.map(function (item) {
            var qty = (privateForm.bambooQty || {})[item.id] || 0;
            return h(
              "div", { key: item.id, className: "flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 border border-white/10" },
              h("div", null, h("div", { className: "text-[13px]" }, item.name), h("div", { className: "text-xs text-white/50" }, money(item.price))),
              h(Stepper, { value: qty, onChange: function (v) { var next = Object.assign({}, privateForm.bambooQty); next[item.id] = v; setPrivateForm(Object.assign({}, privateForm, { bambooQty: next })); } })
            );
          }))
        )
      )
    );

    var page3 = page === 3 && h(
      "main", { className: "max-w-[900px] mx-auto px-4 md:px-6 pb-32 space-y-6" },
      h(
        GlassCard, { className: "p-6 md:p-8" },
        h("div", { className: "flex items-center gap-3" }, h("div", { className: "w-8 h-8 rounded-full flex items-center justify-center bg-[#2E8B57]" }, h(Compass, { size: 16 })), h("h2", { className: "text-2xl font-semibold" }, packageLabel, " Booking")),
        h("div", { className: "mt-8" }, contactFields),
        sharedTourForm2, campingForm2, privatePackageForm2,
        h(
          "button",
          {
            disabled: !contact.name || !contact.whatsapp || !contact.date,
            onClick: function () { setPage(4); },
            className: "mt-8 w-full bg-[#2E8B57] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#257a4b] py-3.5 rounded-full font-semibold flex items-center justify-center gap-2"
          },
          t("nextViewPricing", "Next — View Pricing "), h(ArrowRight, { size: 18 })
        )
      )
    );

    // ---- Page 4: Pricing / invoice calculator (Shared Tour & Camping) --
    var page4 = page === 4 && h(
      "main", { className: "max-w-[1280px] mx-auto px-4 md:px-6 pb-32 space-y-6" },
      h(GlassCard, { className: "p-8 text-center" }, h("h2", { className: "text-3xl font-bold" }, t("pricingFacilities", "Pricing & Facilities")), h("p", { className: "text-white/60 text-sm mt-2" }, packageLabel, " — itemized invoice")),
      h(
        "div", { className: "grid md:grid-cols-[1fr_380px] gap-6" },
        h(
          GlassCard, { className: "p-6" },
          h("h4", { className: "font-semibold mb-4" }, "Invoice"),
          h(
            "div", { className: "space-y-2" },
            invoiceLines().map(function (l, i) {
              return h("div", { key: i, className: "flex justify-between text-[13px] py-1 border-b border-white/5" }, h("span", { className: "text-white/60" }, l[0]), h("span", null, l[1]));
            })
          )
        ),
        h(
          GlassCard, { className: "p-6 h-fit sticky top-24" },
          h("h4", { className: "font-semibold" }, t("totalCalculator", "Total Calculator")),
          h("div", { className: "mt-4 flex justify-between font-bold text-lg" }, h("span", null, t("totalAmount", "Total Amount")), h("span", null, money(grandTotal))),
          h("button", { onClick: function () { setPage(5); }, className: "mt-4 w-full bg-[#2E8B57] hover:bg-[#257a4b] py-3 rounded-full font-semibold" }, t("payNow", "Pay Now")),
          h("div", { className: "text-[11px] text-white/40 text-center mt-2" }, (CONTENT.payment || {}).advanceNote)
        )
      )
    );

    // ---- Page 5: Payment -----------------------------------------------
    var PAY = CONTENT.payment || {};
    var page5 = page === 5 && h(
      "main", { className: "max-w-[900px] mx-auto px-4 md:px-6 pb-32" },
      h(
        GlassCard, { className: "p-6 md:p-8" },
        h("h2", { className: "text-2xl font-semibold" }, t("paymentOptionsTitle", "Payment Options")),
        h(
          "div", { className: "mt-6 flex gap-2 p-1 bg-white/5 rounded-full w-fit border border-white/10" },
          [{ id: "qr", label: t("qrScannerLabel", "QR Scanner"), icon: QrCode }, { id: "upi", label: t("upiIdLabel", "UPI ID"), icon: CreditCard }, { id: "bank", label: t("bankTransferLabel", "Bank Transfer"), icon: Building2 }].map(function (p) {
            return h("button", { key: p.id, onClick: function () { setPayTab(p.id); }, className: "px-5 py-2 rounded-full text-sm flex items-center gap-2 transition " + (payTab === p.id ? "bg-white text-black" : "text-white/60 hover:text-white") }, h(p.icon, { size: 14 }), p.label);
          })
        ),
        h(
          "div", { className: "mt-8 grid md:grid-cols-[320px_1fr] gap-8" },
          h(
            "div", null,
            payTab === "qr" && h(
              "div", { className: "space-y-4" },
              h(
                "div", { className: "aspect-square rounded-[20px] bg-white p-4 flex items-center justify-center relative overflow-hidden border border-white/10" },
                h(
                  "div", { className: "relative text-center" },
                  window.KC_IMAGES.qrCode
                    ? h("img", { src: window.KC_IMAGES.qrCode, className: "w-full h-full max-w-[280px] max-h-[280px] mx-auto object-contain rounded-[8px]" })
                    : h("div", { className: "w-40 h-40 mx-auto bg-black text-white flex items-center justify-center text-[10px] font-mono p-2" }, "UPI QR", h("br"), CONTENT.upiId, h("br"), money(grandTotal)),
                  h("div", { className: "mt-3 text-black text-xs font-semibold" }, t("scanToPayLabel", "Scan to Pay ₹"), grandTotal)
                )
              ),
              window.KC_IMAGES.qrCode && h(
                "a", {
                  href: window.KC_IMAGES.qrCode,
                  download: "krem-chympe-upi-qr.png",
                  className: "flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm"
                },
                h(Download, { size: 14 }), PAY.downloadQr || " Download QR"
              )
            ),
            payTab === "upi" && h(
              GlassCard, { className: "p-5 !rounded-[16px]" },
              h("div", { className: "text-xs text-white/50" }, t("upiIdLabel", "UPI ID")),
              h("div", { className: "mt-2 flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-3 py-2.5" }, h("span", { className: "text-sm font-mono" }, CONTENT.upiId), h("button", { onClick: function () { copyToClipboard(CONTENT.upiId, "upi"); }, className: "w-7 h-7 rounded-full bg-white text-black flex items-center justify-center" }, copied === "upi" ? h(Check, { size: 14 }) : h(Copy, { size: 14 }))),
              h("div", { className: "mt-3 text-xs text-white/50" }, "Amount: ", money(grandTotal))
            ),
            payTab === "bank" && h(
              GlassCard, { className: "p-5 !rounded-[16px] space-y-3" },
              [{ label: PAY.accountNameLabel, value: CONTENT.bank.name }, { label: PAY.accountNumberLabel, value: CONTENT.bank.account }, { label: PAY.ifscLabel, value: CONTENT.bank.ifsc }, { label: PAY.bankLabel, value: CONTENT.bank.bankName }].map(function (p) {
                return h(
                  "div", { key: p.label, className: "flex justify-between items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2" },
                  h("div", null, h("div", { className: "text-[10px] text-white/40" }, p.label), h("div", { className: "text-xs font-mono" }, p.value)),
                  h("button", { onClick: function () { copyToClipboard(p.value, p.label); }, className: "w-7 h-7 rounded-full bg-white/10 flex items-center justify-center" }, copied === p.label ? h(Check, { size: 12 }) : h(Copy, { size: 12 }))
                );
              })
            )
          ),
          h(
            "div", { className: "space-y-6" },
            h(
              GlassCard, { className: "p-5 !rounded-[16px]" },
              h("div", { className: "text-sm font-medium" }, t("orderSummary", "Order Summary")),
              h(
                "div", { className: "mt-3 space-y-2 text-[13px]" },
                h("div", { className: "flex justify-between" }, h("span", { className: "text-white/60" }, t("packageLabel", "Package")), h("span", null, packageLabel)),
                h("div", { className: "flex justify-between font-bold pt-2 border-t border-white/10" }, h("span", null, t("totalLabel", "Total")), h("span", null, money(grandTotal)))
              )
            ),
            h(
              "div", null,
              h("label", { className: "text-xs text-white/60" }, "Advance Payment (Min " + money(minAdvance) + ")"),
              h("input", { type: "number", min: minAdvance, value: advance, onChange: function (e) { setAdvance(Math.max(0, Number(e.target.value))); }, className: "mt-2 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none text-sm" }),
              advance < minAdvance && h("div", { className: "text-[11px] text-red-300 mt-2" }, PAY.advanceHelperText),
              h("div", { className: "mt-2 text-xs text-white/50" }, t("balanceLeftLabel", "Balance left to pay on arrival: ₹"), balanceLeft)
            ),
            h(
              GlassCard, { className: "p-4 !rounded-[16px] flex gap-3" },
              h("div", { className: "w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center" }, h(Shield, { size: 14, className: "text-emerald-400" })),
              h("div", { className: "text-[12px] text-white/60" }, "Pay using any of the methods above, then tap Submit — your package, selected items, and payment details open in WhatsApp, ready to send to the tour guide for confirmation.")
            ),
            submitError && h("div", { className: "text-[12px] text-amber-300" }, submitError),
            h("button", {
              onClick: submitBookingViaWhatsApp,
              disabled: advance < minAdvance,
              className: "kc-whatsapp-btn"
            }, h(Phone, { size: 18 }), t("submitBookingButton", "Submit"))
          )
        )
      )
    );

    // ---- Page 6: Confirmation -------------------------------------------
    var page6 = page === 6 && h(
      "main", { className: "max-w-[600px] mx-auto px-4 md:px-6 pb-32" },
      h(
        GlassCard, { className: "p-10 text-center" },
        h("div", { className: "w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center" }, h(Check, { size: 36, className: "text-emerald-400" })),
        h("h2", { className: "mt-6 text-3xl font-bold" }, t("bookingConfirmedTitle", "Request Sent!")),
        bookingCode && h(
          "div",
          { className: "mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs bg-emerald-500/15 border border-emerald-400/30 text-emerald-300" },
          h("span", { className: "w-2 h-2 rounded-full bg-current" }),
          "Sent to the tour guide on WhatsApp — awaiting their confirmation there"
        ),
        h("p", { className: "mt-3 text-white/60 text-sm" }, t("thankYouPrefix", "Thank you "), contact.name, t("thankYouMiddle", "! Your adventure is secured. We have received advance ₹"), advance, t("thankYouBalanceMid", ". Balance ₹"), balanceLeft, t("thankYouSuffix", " to be paid on arrival.")),
        bookingCode && h(
          "div", { className: "mt-4 inline-block px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-mono" },
          "Reference: #", bookingCode
        ),
        submitError && h("p", { className: "mt-3 text-amber-300 text-xs" }, submitError),
        h(
          "div", { className: "mt-8 text-left p-4 rounded-xl bg-white/5 border border-white/10 text-[13px] space-y-2" },
          h("div", { className: "flex justify-between" }, h("span", { className: "text-white/50" }, t("packageLabel", "Package")), h("span", null, packageLabel)),
          h("div", { className: "flex justify-between" }, h("span", { className: "text-white/50" }, t("dateLabel", "Date")), h("span", null, contact.date)),
          h("div", { className: "flex justify-between" }, h("span", { className: "text-white/50" }, t("totalLabel", "Total")), h("span", null, money(grandTotal)))
        ),
        h(
          "div", { className: "mt-6 flex flex-col gap-3" },
          h(
            "a", {
              href: whatsappLink(),
              target: "_blank",
              className: "kc-whatsapp-btn"
            },
            h(Phone, { size: 18 }),
            "WhatsApp"
          )
        ),
        h("button", { onClick: function () { setPage(1); setPkg(null); setBookingCode(""); setSubmitError(""); setSubmitted(false); }, className: "mt-4 w-full bg-white/5 border border-white/10 py-3 rounded-full font-semibold" }, t("backToHome", "Back to Home"))
      )
    );

    // ---- Bottom nav -------------------------------------------------
    // Pages 2 and 3 each have their own dedicated call-to-action button
    // (package cards, and the booking form's "Next" submit button), so the
    // generic bottom-nav "Next" only needs to handle page 1.
    var totalPages = 6;
    var bottomNav = h(
      "div", { className: "fixed bottom-0 inset-x-0 z-30 p-3 md:p-4 pointer-events-none" },
      h(
        GlassCard, { className: "max-w-[1280px] mx-auto px-4 py-3 flex justify-between items-center pointer-events-auto" },
        h("button", {
          disabled: page === 1,
          onClick: function () {
            setPage(Math.max(1, page - 1));
          },
          className: "px-5 py-2 rounded-full bg-white/10 border border-white/10 text-sm flex items-center gap-2 disabled:opacity-40"
        }, h(ArrowLeft, { size: 16 }), t("back", " Back")),
        h("div", { className: "flex items-center gap-2 text-[11px] text-white/40" }, h("span", { className: "w-2 h-2 rounded-full bg-emerald-400 animate-pulse" }), " Page ", page, " / ", totalPages),
        page === 1 && h("button", {
          onClick: function () { setPage(2); },
          className: "px-6 py-2 rounded-full bg-[#2E8B57] hover:bg-[#257a4b] text-sm font-medium flex items-center gap-2"
        }, t("next", "Next "), h(ArrowRight, { size: 16 })),
        page !== 1 && h("div", { className: "w-[92px]" })
      )
    );

    return h(
      "div", { className: "min-h-screen text-white font-[Inter,Poppins,sans-serif] relative selection:bg-emerald-500/30" },
      h(
        "div", { className: "fixed inset-0 -z-10" },
        h("img", { src: CONTENT.backgrounds[0], className: "w-full h-full object-cover" }),
        h("div", { className: "absolute inset-0 bg-black/40 backdrop-blur-[1px]" }),
        h("div", { className: "absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" })
      ),
      header, page1, page2, page3, page4, page5, page6, bottomNav,
      h("style", null, "\n        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@500;600;700&display=swap');\n        *{font-family:Inter, Poppins, sans-serif}\n        ::-webkit-scrollbar{width:6px;height:6px}\n        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:99px}\n      ")
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(h(React.StrictMode, null, h(App)));
})();
