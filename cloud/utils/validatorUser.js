"use strict";

const validateFullName = (fullName) => {
  if (!fullName || fullName.trim().length === 0) {
    throw new Error("Please provide a full name");
  }
};

const validateEmail = (email) => {
  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    throw new Error("Please provide a valid email address");
  }
};

const validatePassword = (password) => {
  if (
    !password ||
    !password.trim() ||
    password.length < 8 ||
    !password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/)
  ) {
    throw new Error(
      "Password must be at least 8 characters long, must contain at least 1 uppercase, 1 lowercase, 1 number and 1 symbol"
    );
  }
};

const validateBio = (bio) => {
  if (bio && bio.length > 500) {
    throw new Error("Bio cannot be longer than 500 chars.");
  }
};

const validateTravelInterests = (travelInterests) => {
  if (travelInterests && travelInterests.length > 500) {
    throw new Error("Travel interests cannot be longer than 500 chars.");
  }
};

const validateSocialMediaLinks = (socialMediaLinks) => {
  if (socialMediaLinks && socialMediaLinks.length > 100) {
    throw new Error("Social media links cannot be longer than 100 characters");
  }
};

const validCountries = [
  "afghanistan",
  "albania",
  "algeria",
  "andorra",
  "angola",
  "antigua and barbuda",
  "argentina",
  "armenia",
  "australia",
  "austria",
  "azerbaijan",
  "bahamas",
  "bahrain",
  "bangladesh",
  "barbados",
  "belarus",
  "belgium",
  "belize",
  "benin",
  "bhutan",
  "bolivia",
  "bosnia and herzegovina",
  "botswana",
  "brazil",
  "brunei",
  "bulgaria",
  "burkina faso",
  "burundi",
  "cabo verde",
  "cambodia",
  "cameroon",
  "canada",
  "central african republic",
  "chad",
  "chile",
  "china",
  "colombia",
  "comoros",
  "congo (congo-brazzaville)",
  "costa rica",
  "cote d'ivoire (ivory coast)",
  "croatia",
  "cuba",
  "cyprus",
  "czechia (czech republic)",
  "democratic republic of the congo (congo-kinshasa)",
  "denmark",
  "djibouti",
  "dominica",
  "dominican republic",
  "ecuador",
  "egypt",
  "el salvador",
  "equatorial guinea",
  "eritrea",
  "estonia",
  "eswatini (fmr. 'swaziland')",
  "ethiopia",
  "fiji",
  "finland",
  "france",
  "gabon",
  "gambia",
  "georgia",
  "germany",
  "ghana",
  "greece",
  "grenada",
  "guatemala",
  "guinea",
  "guinea-bissau",
  "guyana",
  "haiti",
  "honduras",
  "hungary",
  "iceland",
  "india",
  "indonesia",
  "iran",
  "iraq",
  "ireland",
  "israel",
  "italy",
  "jamaica",
  "japan",
  "jordan",
  "kazakhstan",
  "kenya",
  "kiribati",
  "korea, north",
  "korea, south",
  "kosovo",
  "kuwait",
  "kyrgyzstan",
  "laos",
  "latvia",
  "lebanon",
  "lesotho",
  "liberia",
  "libya",
  "liechtenstein",
  "lithuania",
  "luxembourg",
  "madagascar",
  "malawi",
  "malaysia",
  "maldives",
  "mali",
  "malta",
  "marshall islands",
  "mauritania",
  "mauritius",
  "mexico",
  "micronesia",
  "moldova",
  "monaco",
  "mongolia",
  "montenegro",
  "morocco",
  "mozambique",
  "myanmar (formerly burma)",
  "namibia",
  "nauru",
  "nepal",
  "netherlands",
  "new zealand",
  "nicaragua",
  "niger",
  "nigeria",
  "north macedonia",
  "norway",
  "oman",
  "pakistan",
  "palau",
  "panama",
  "papua new guinea",
  "paraguay",
  "peru",
  "philippines",
  "poland",
  "portugal",
  "qatar",
  "romania",
  "russia",
  "rwanda",
  "saint kitts and nevis",
  "saint lucia",
  "saint vincent and the grenadines",
  "samoa",
  "san marino",
  "sao tome and principe",
  "saudi arabia",
  "senegal",
  "serbia",
  "seychelles",
  "sierra leone",
  "singapore",
  "slovakia",
  "slovenia",
  "solomon islands",
  "somalia",
  "south africa",
  "south sudan",
  "spain",
  "sri lanka",
  "sudan",
  "suriname",
  "sweden",
  "switzerland",
  "syria",
  "taiwan",
  "tajikistan",
  "tanzania",
  "thailand",
  "timor-leste (east timor)",
  "togo",
  "tonga",
  "trinidad and tobago",
  "tunisia",
  "turkey",
  "turkmenistan",
  "tuvalu",
  "uganda",
  "ukraine",
  "united arab emirates",
  "united kingdom",
  "united states of america",
  "uruguay",
  "uzbekistan",
  "vanuatu",
  "vatican city",
  "venezuela",
  "vietnam",
  "yemen",
  "zambia",
  "zimbabwe",
];

const validateCountry = (country) => {
  if (!country || !validCountries.includes(country.toLowerCase())) {
    throw new Error("Please provide a valid country.");
  }
};

module.exports = {
  validateFullName,
  validateEmail,
  validatePassword,
  validateBio,
  validateTravelInterests,
  validateSocialMediaLinks,
  validateCountry,
};
