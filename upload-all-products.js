// Smart bulk product upload script
const products = [
  {
    brand: "MICHAEL KORS",
    model: "Premium Collection",
    price: 1599,
    previousPrice: 2460,
    description: "Elegant Michael Kors timepiece with premium design and superior craftsmanship. Perfect for modern professionals seeking luxury and style.",
    images: [
      "https://lh3.googleusercontent.com/d/1ztXDKVkaFkaDiVidJJNIoe1db8pQH5e5",
      "https://lh3.googleusercontent.com/d/17X5l2sX9uI3wxkOeGqIuKGD0_Q8DDfN8",
      "https://lh3.googleusercontent.com/d/1UsWv9DOyQDFwJZNdxuMyaDpnCpr0MleC",
      "https://lh3.googleusercontent.com/d/1V0YFpVC57gTjv_REO1pOvg64gT9FRMo2",
      "https://lh3.googleusercontent.com/d/1OyXN3cB-ApjC63rFvmbbEvLB8oDL3jei",
      "https://lh3.googleusercontent.com/d/1NBdRlSScHEnW5C5OGRVnWz2T2udjGzCH",
      "https://lh3.googleusercontent.com/d/1JehJqzkmx6TlOtgYZVrbSvbksyCIJXnc",
      "https://lh3.googleusercontent.com/d/1EiOvZBMN16RXZmDt3rIGFGNWBFTCm2tj"
    ]
  },
  {
    brand: "OMEGA X SWATCH",
    model: "Mission to Moon",
    price: 1050,
    previousPrice: 1615,
    description: "🌟 A Celestial Fusion of Elegance and Innovation – For the Bold and Stylish 🌟 Iconic White Dial with Pink Sub-dials, Matte Black Tachymeter Bezel, Bold Pink Bioceramic Case, Triple Chronograph Sub-dials, Unique Planetary Moon Phase Graphics, Matching Pink Fabric Velcro Strap, Swiss Quartz Precision, Lightweight & Comfortable.",
    images: [
      "https://lh3.googleusercontent.com/d/1T3NaqgRtmDhXB-rzy5gAgSA0LmRZoCGc",
      "https://lh3.googleusercontent.com/d/1YOJvNE8KwT1UrZBsjesTD4FjAs86zrFc",
      "https://lh3.googleusercontent.com/d/1EJgDcHruTDrSls-S6U8HAcBInfXMyz2j",
      "https://lh3.googleusercontent.com/d/1kw4iZpF-enzlqq4H6WGlnx44Etwz4-fa",
      "https://lh3.googleusercontent.com/d/1txCsHkv5I4TDsj3bBvZ9XvbUGQuGIML2",
      "https://lh3.googleusercontent.com/d/1Q4ZOpkhZ5Q0h-gSXP-wVVwp4dbzW2CH5"
    ]
  },
  {
    brand: "ROLEX",
    model: "Oyster Perpetual Cosmograph",
    price: 1350,
    previousPrice: 2077,
    description: "ROLEX OYSTER PERPETUAL COSMOGRAPH - Highest Quality Stainless Steel Bracelet, Sapphire Glass, Quartz Movement, 41mm Case Diameter, 10mm Case Thickness, Golden Bracelet, Round Dial. Extra Original box with manual and tags.",
    images: [
      "https://lh3.googleusercontent.com/d/1k2fdzO724tiwxwmlu3A0JCTI517VpyWT",
      "https://lh3.googleusercontent.com/d/1TXwxpypoZG1n_FJ3erTpZFqWWtnOAaZh",
      "https://lh3.googleusercontent.com/d/1bfbi8OOTYGgE_fLxBCMvAeMUlwXzwa_e",
      "https://lh3.googleusercontent.com/d/1ZaV1EUrscDOQPZ1f9P6F1utX-LsvMOqR",
      "https://lh3.googleusercontent.com/d/1-DWihYnIqQYgJ_Y3KREwzSxPBaKSDIsF",
      "https://lh3.googleusercontent.com/d/1BuYFajFhEkuVSL5jNaVyVELLDkpL_cEP"
    ]
  },
  {
    brand: "ARMANI EXCHANGE",
    model: "Premium Collection",
    price: 1050,
    previousPrice: 1615,
    description: "LIMITED EDITION A/X ARMANI EXCHANGE - 7AAA COPY, HIGH END QUALITY, Original model with Glareproofed sapphire crystal Glass, Metal Strap chain, Quartz Movement, ROYAL LOOK, 100% GOOD MACHINE Heavy lock, TOP QUALITY WITH BUDGET PRICE.",
    images: [
      "https://lh3.googleusercontent.com/d/1ar4Miw7GtXBHzF0d44YFB_b4lRaqQHiO",
      "https://lh3.googleusercontent.com/d/1xVZnKZUN2nAbIo8HxXpk_-XLhHiRyPXA",
      "https://lh3.googleusercontent.com/d/1zt9aVv-NbhI0vuXheGcbmybIPM3_idnc",
      "https://lh3.googleusercontent.com/d/1cpPmSo0r1Q7noHgAiBj-wXZbiR9CcLOa",
      "https://lh3.googleusercontent.com/d/1WPtjlWAtgY_P0fV7lolCciD41a48DAdT",
      "https://lh3.googleusercontent.com/d/12Z_hCqomFkBAPXBImdqQ4srH_PE8YpUL",
      "https://lh3.googleusercontent.com/d/1hJ1tT4UsgYV5OxIe3jhIppeXnpRvWo3u",
      "https://lh3.googleusercontent.com/d/1ZB91oX_vMCEPc4QMUpmP8ZHV3IKYVA4N"
    ]
  },
  {
    brand: "ARMANI FOSSIL",
    model: "Submariner Series",
    price: 1400,
    previousPrice: 2154,
    description: "7AAA Premium Collection Submariner Series - AN AUTOMATIC MECHANISM IN STEEL LUXURY BELT, back open machine, 12 Hour analog, automatic machine, Water resistant, Stainless steel gold, Luxurious dial with color, Heavy original Rolex clip lock, Original Japanese case movement machinery, FULL AUTOMATIC MACHINE.",
    images: [
      "https://lh3.googleusercontent.com/d/1vX7eyDEvWIQjyYEkgX_fjSRv-Wkq7PdO",
      "https://lh3.googleusercontent.com/d/1r0-zKIjkO6Tp4eP3lxsSKDX3yt-2ZL8i",
      "https://lh3.googleusercontent.com/d/1c0IXyvI7lzzHcOf9YGlneG3EToj4vRb2",
      "https://lh3.googleusercontent.com/d/1BHGpvZSuY6sxQBhMSPNnCxXN32HNZnVT"
    ]
  },
  {
    brand: "AUDEMARS PIGUET",
    model: "Royal Oak Collection",
    price: 1599,
    previousPrice: 2460,
    description: "Premium Audemars Piguet inspired timepiece with exceptional craftsmanship and luxury design. Perfect for discerning watch enthusiasts.",
    images: [
      "https://lh3.googleusercontent.com/d/1O5XzyH3bIKnyN53Pe1r3pMNq2DjCvTIS",
      "https://lh3.googleusercontent.com/d/15bnb6___xNILWRIgnoeiQY_LKUFEsQCU",
      "https://lh3.googleusercontent.com/d/1zCqRXzkVMru7ezRC_5Azoo9Gcho5aDbq",
      "https://lh3.googleusercontent.com/d/1IsRX3wYwkXFveSElgcZJOOfID_wwqze2",
      "https://lh3.googleusercontent.com/d/1NCVTzlMEKVLS9EjPUq1bIWmYWfy5KEUY",
      "https://lh3.googleusercontent.com/d/17ipEG6y_gmLseYfXX4dkK0OnXLdtW3Ho",
      "https://lh3.googleusercontent.com/d/1WqjPOgPIHtXhf98rDPxnHBWIH9qyir_-"
    ]
  },
  {
    brand: "CARTIER",
    model: "Santos Collection",
    price: 1599,
    previousPrice: 2460,
    description: "Elegant Cartier inspired timepiece with sophisticated design and premium materials. A symbol of luxury and refinement.",
    images: [
      "https://lh3.googleusercontent.com/d/1Mfijmxt9i5xPd4-11ienh9uRAo7V7CtH",
      "https://lh3.googleusercontent.com/d/1yxenKuM2oRHBfjwMogWw4111hejoYuZe",
      "https://lh3.googleusercontent.com/d/1_kLNiFpKrWQRkoOih0q1u7Aj0gXcQYWM",
      "https://lh3.googleusercontent.com/d/1hoPe6WjTzx1rTo1JNyisJBMRdiPaFw24",
      "https://lh3.googleusercontent.com/d/17tV4_5PBFrTo5nsVBu-PKNLYTDOHBGQ9",
      "https://lh3.googleusercontent.com/d/1OWskcOA8uwAYg_JhsAjcGc0FujU61fsd",
      "https://lh3.googleusercontent.com/d/1rtYteVxv5b2YE9VsPxff5WqTBvHDwlNB",
      "https://lh3.googleusercontent.com/d/12nSnbFevns1-gPFvK2uqaE2Z_8slmkHi"
    ]
  },
  {
    brand: "CASIO",
    model: "Vintage Collection",
    price: 1599,
    previousPrice: 2460,
    description: "Classic Casio vintage inspired timepiece with retro design and modern functionality. Perfect for casual and professional wear.",
    images: [
      "https://lh3.googleusercontent.com/d/1XW9veI1csAS2mwEiuQjgQT2WjUCyofhV",
      "https://lh3.googleusercontent.com/d/12ITzToQOu7pGxEaLZZMIGA3Wes0clIty",
      "https://lh3.googleusercontent.com/d/1-rTkHfLBtEAwPhv0ICC0SCoTMBizy0Jc",
      "https://lh3.googleusercontent.com/d/1EZz4Ex1FywMO8w44OlA0Esf6RDqG7Pio",
      "https://lh3.googleusercontent.com/d/19GImerr9Nx18XrU61FAmzpEAJeAda0vs",
      "https://lh3.googleusercontent.com/d/1PO5m3Dcxz4ynIUgJvk4UoZTY31Ga9NI1",
      "https://lh3.googleusercontent.com/d/1BlTuLpYoVvNfd2B2Ai-VeV3TI_0IW5Yr"
    ]
  },
  {
    brand: "CASIO",
    model: "MTP-B146D-AV",
    price: 750,
    previousPrice: 1154,
    description: "CASIO men's MTP-B146D-AV - Quartz movement, Date or Day window, Sunburst dial, Classic strap (metal), Minimalist Design, St steel back & pressing lock, Lightweight & Comfortable – Easy to wear for long hours.",
    images: [
      "https://lh3.googleusercontent.com/d/1fB53atzbgTJWESnxGwVIGTSYZ5SfpWqK",
      "https://lh3.googleusercontent.com/d/1RS_5lLQVktYeXTUWQlUyyAlcEUIImn_f",
      "https://lh3.googleusercontent.com/d/1BbBxUOoRNVjOdgcRMLDj5pAEiKWAfEh7"
    ]
  },
  {
    brand: "CORUM",
    model: "Timepiece Collection",
    price: 1599,
    previousPrice: 2460,
    description: "Premium Corum inspired timepiece with unique design and exceptional quality. A statement piece for watch collectors.",
    images: [
      "https://lh3.googleusercontent.com/d/17Z5unTO-kjXesZsCQ14LzQ2On4OE-eaZ",
      "https://lh3.googleusercontent.com/d/1aFg7AzJq69PrvuBKdZ2zQATW9LYcPEbO",
      "https://lh3.googleusercontent.com/d/1hHvE4z0z5isYRTjJXSfFad2Qa0mtGanM",
      "https://lh3.googleusercontent.com/d/1o1AAMZVcB9Psz6NaK1TV6lqpVnEG2rvJ",
      "https://lh3.googleusercontent.com/d/1BKXIdqYHhHplzYTCqCgRNmWxeul0ppg6"
    ]
  },
  {
    brand: "DIESEL",
    model: "SABR Collection",
    price: 1599,
    previousPrice: 2460,
    description: "Bold Diesel SABR timepiece with rugged design and modern aesthetics. Perfect for those who love statement watches.",
    images: [
      "https://lh3.googleusercontent.com/d/1j3xrJUWvWvRp3Zzq9Wm7cn8_hPIsp6dq",
      "https://lh3.googleusercontent.com/d/1ot88e9HEbZWrLLI7uoue_3L2G7ygGPxk",
      "https://lh3.googleusercontent.com/d/15CJisAl2qKmB417LaWQF5tnMWhBU9kHX",
      "https://lh3.googleusercontent.com/d/1JCnCtBeICszCfxY0LJ5X6-Czzwd4ZRW_",
      "https://lh3.googleusercontent.com/d/1DRkZjUbSEaed3zSwRSC1KPt0JfXfNQcN",
      "https://lh3.googleusercontent.com/d/1rFavJQwchIhzzhfm7hUCKMw-w8wSkocn"
    ]
  },
  {
    brand: "CASIO",
    model: "Edifice ECB-2000P",
    price: 1599,
    previousPrice: 2460,
    description: "Professional Casio Edifice ECB-2000P with advanced features and sleek design. Perfect for business professionals.",
    images: [
      "https://lh3.googleusercontent.com/d/1g68e4nPLohGp4-V7DIgEX4mOTu-YyHkT",
      "https://lh3.googleusercontent.com/d/17ilIUc52ALY4p28lU8Bid34R45wy_VJ5",
      "https://lh3.googleusercontent.com/d/1B8DwC50cP46qAT9TmqxWe8-DxCIJDuXg",
      "https://lh3.googleusercontent.com/d/106O2Q7PHYUxE56C8Mhr3-wv4wJMoxVvV"
    ]
  },
  {
    brand: "FOSSIL",
    model: "Nate Chronograph",
    price: 1150,
    previousPrice: 1770,
    description: "Fossil Nate Chronograph - Inspired by architecture with simple proportions and symmetry. Working Chronograph, Date Counter, Big Visible Number Figures, Brown Phase Functional, Black Stainless Steel Matt Body, Black Multipurpose Smart fit strap, Easy push buttons, 100% Quality performance quartz Chronograph machinery.",
    images: [
      "https://lh3.googleusercontent.com/d/1mrdgZWlf500X67gjbc3TxI2Sv4hGqZ0q",
      "https://lh3.googleusercontent.com/d/1HKO-MM2HHfDbKUtmpAYO9Kj6UnpV3uLm",
      "https://lh3.googleusercontent.com/d/1E9Tj1SR5bYwkDi3pXYyreg-p-PYbQHCs",
      "https://lh3.googleusercontent.com/d/1f198tb-a5DBBt3ULyNQRf461DitLEONs"
    ]
  },
  {
    brand: "FOSSIL",
    model: "Classic Collection",
    price: 1599,
    previousPrice: 2460,
    description: "Timeless Fossil Classic timepiece with elegant design and reliable performance. A perfect blend of style and functionality.",
    images: [
      "https://lh3.googleusercontent.com/d/11LxcLA5PZbHU7z6Pls7WI3D8KyqrTdaW",
      "https://lh3.googleusercontent.com/d/1l3BUyBVITjQ-rRwhWW_sKCa9bv5hIyIC",
      "https://lh3.googleusercontent.com/d/1M45JCDST_bklyEbN6sIbFRuLTLo9X1an",
      "https://lh3.googleusercontent.com/d/1g2rslC6q5nwoMlq-8BTZS-lGg7JdKPWC",
      "https://lh3.googleusercontent.com/d/14Nwrdf6ZfSJz-sOJSqsMEIDrJOdxpemA",
      "https://lh3.googleusercontent.com/d/1tO39hig_H0GJZaZJOgkVnOTVvEWemdix",
      "https://lh3.googleusercontent.com/d/1-MfEL-iVLdmucX6xPqFLJBOONSTzfxJ2"
    ]
  },
  {
    brand: "TOMMY HILFIGER",
    model: "Modern Automatic",
    price: 1200,
    previousPrice: 1846,
    description: "Tommy Hilfiger Modern Automatic - 7AA Premium Collection, Working 24 Hour Analog, Stainless Steel black Body, full color, stainless steel, day & date working, original modal, No colour issue and rusting, silicone Belt, Original Japanese heavy Engine, 100% Satisfaction.",
    images: [
      "https://lh3.googleusercontent.com/d/1L8L-XClD4zh5BN5nHDLoqZVlOu68PhqK",
      "https://lh3.googleusercontent.com/d/1sqJpEO_SpVhs-tm0osz5KM5x0Jg85jDN",
      "https://lh3.googleusercontent.com/d/1blH34_Ld72CfGb0cyxpv13dMvzRRM3jc",
      "https://lh3.googleusercontent.com/d/1sfyEr2s_U39t8zPP-mzuxDvMSK3EpADy"
    ]
  },
  {
    brand: "TOMMY HILFIGER",
    model: "SATM Water Resistant",
    price: 1500,
    previousPrice: 2308,
    description: "Tommy Hilfiger SATM Water Resistant - 7AA Premium Collection, Working 24 Hour Analog, Stainless Steel Gold Body, full black, Transparent Front & Back, Pendulum Rotate charging, Fully Automatic self wind machine, No colour issue and rusting, metal Belt, Original Japanese Automatic Engine, 100% Satisfaction.",
    images: [
      "https://lh3.googleusercontent.com/d/1j4qny8xgMvjIrGDTDlpSeeMrIQ26oayq",
      "https://lh3.googleusercontent.com/d/1firZdyJbmTN1ZddDq-iPrY2o9SE_fFQF",
      "https://lh3.googleusercontent.com/d/1T67FWze2az6k0_IwJRgGfdaInele7Yt-",
      "https://lh3.googleusercontent.com/d/1M4zZipBKOPS-MVv8qJJexDvJhr0oikIB",
      "https://lh3.googleusercontent.com/d/19rBmnms9tLDD1wW3ppiKqslpW5Y58Rh8"
    ]
  },
  {
    brand: "HUBLOT",
    model: "Big Bang",
    price: 1050,
    previousPrice: 1615,
    description: "Hublot Big Bang - Quartz movement, All chronographs working, Date wheel, Bold Bezel with Screws, St steel back & Hublot bfly lock. Bold and luxurious design with striking skeleton dial and sleek rubber straps.",
    images: [
      "https://lh3.googleusercontent.com/d/1Pq0Y8s_UlU8bGAbhRleaft2RRQacwgR_",
      "https://lh3.googleusercontent.com/d/1zImh5FNa0h3L6QuW2CQxImVlry62-0Pt",
      "https://lh3.googleusercontent.com/d/1nH9J7poXk2aI5pRFKBOtbNxM1zf3fJYn",
      "https://lh3.googleusercontent.com/d/1cLrUI3U2zTrESpyPEQDWfCB9ZONsQSzW",
      "https://lh3.googleusercontent.com/d/1kOqFbnpmYRAouXzgNkgVrvAQzJ7LNaxQ",
      "https://lh3.googleusercontent.com/d/1MCgqEcZlx_GEZcHuRVi8VewzxK7t8Z75",
      "https://lh3.googleusercontent.com/d/1ZJubaAJ98EWyLIbhmUGuyiYl4oUUaWP_",
      "https://lh3.googleusercontent.com/d/1_YhTmCB010FbrQnSD3jix_UN7o-jvYWW"
    ]
  },
  {
    brand: "HUBLOT",
    model: "Geneve Big Bang",
    price: 850,
    previousPrice: 1308,
    description: "Hublot Geneve Big Bang - For men's watch with Date working. Premium quality with distinctive design and reliable performance.",
    images: [
      "https://lh3.googleusercontent.com/d/1CW2kDLGgczrgSSLwjK5SDPGRYidBi2Cz",
      "https://lh3.googleusercontent.com/d/10geVZ1gt-biB0FSjc4xT26qOjcQgqwIs",
      "https://lh3.googleusercontent.com/d/1IOt-83gu8_pEHahng3Pc_dNXCc5Q0ttB",
      "https://lh3.googleusercontent.com/d/18FFjx53ElVLos5om3nxz0Zvq-iWoHhQj",
      "https://lh3.googleusercontent.com/d/1QSMZgCyjUmq6wh41nMKTLhBCr7UK9Ead",
      "https://lh3.googleusercontent.com/d/1DkfENg91T3vqU6Td_H_IxcOx-frleffw",
      "https://lh3.googleusercontent.com/d/1g63KfHlbID-WTRtJIc8-jyL8y_KjkXqn"
    ]
  },
  {
    brand: "NIKE",
    model: "Sports Collection",
    price: 850,
    previousPrice: 1308,
    description: "New Nike model - Premium sports watch with modern design and athletic functionality. Perfect for active lifestyle.",
    images: [
      "https://lh3.googleusercontent.com/d/1f4QZvxys24EaAdV1YbwgnHuj3s6s2vVK",
      "https://lh3.googleusercontent.com/d/1Bw9ZhNMr2nkR9x9gvZjSozXSuIzz0B_q",
      "https://lh3.googleusercontent.com/d/1Vvg02lt4UEhazOI8oHnD8G_WyvPSfKny",
      "https://lh3.googleusercontent.com/d/1AHQo8kD9JWMmzzWDSOcbou3YSft3672B",
      "https://lh3.googleusercontent.com/d/1xqbx6Av9gXgDhJsdU_-qZrIQF-AruQOD",
      "https://lh3.googleusercontent.com/d/1nUQci8Oevxx_N1pzTjFhFK0_Kg2Cec6u"
    ]
  },
  {
    brand: "ROLEX",
    model: "Oyster Perpetual Cosmograph",
    price: 1350,
    previousPrice: 2077,
    description: "ROLEX OYSTER PERPETUAL COSMOGRAPH - Highest Quality Stainless Steel Bracelet, Sapphire Glass, Quartz Movement, 41mm Case Diameter, 10mm Case Thickness, Golden Bracelet, Round Dial. Extra Original box with manual and tags.",
    images: [
      "https://lh3.googleusercontent.com/d/1Cr7Oa5AVCIXIsXy63ePmwjSgwMFYOCyA",
      "https://lh3.googleusercontent.com/d/11xTRotCs-r8qno8EFf25AQxBN7AD0nOJ",
      "https://lh3.googleusercontent.com/d/1P7qDnRgj89cMzM98IpzzIDvXqSA19-zX",
      "https://lh3.googleusercontent.com/d/15A9DHLJEzTAymdwaLUoL1I4OklSidoAB",
      "https://lh3.googleusercontent.com/d/1zULFGAmNIhqTkVkm2Jq7rBd3E4UmIv8i"
    ]
  },
  {
    brand: "SEIKO",
    model: "Premium Collection",
    price: 1599,
    previousPrice: 2460,
    description: "Premium Seiko timepiece with Japanese precision and elegant design. A perfect combination of tradition and innovation.",
    images: [
      "https://lh3.googleusercontent.com/d/1loxeblBUztJuBlYEqYkD8WhjU3QUOrIX",
      "https://lh3.googleusercontent.com/d/1Z5oC_bxOmMNXuaW94JPnFwi9zrz7dbQJ",
      "https://lh3.googleusercontent.com/d/15Hu5g9yCrviw4cF_hgX2DnMK2lW8Jc3r",
      "https://lh3.googleusercontent.com/d/12tQsPFhk2IxNab6Axpae3eYU0YTWy1j9",
      "https://lh3.googleusercontent.com/d/1bi0eBoAtn7kkAZZC306uuQQLXjmGSpmZ",
      "https://lh3.googleusercontent.com/d/17KAgHfXJIOc8ltASn6qLNmVRLQ8lFK-p",
      "https://lh3.googleusercontent.com/d/12Rbt7bhNL90DdT2mEjWnAig8Q5ExB1ic"
    ]
  },
  {
    brand: "TAG HEUER",
    model: "Carrera Collection",
    price: 1599,
    previousPrice: 2460,
    description: "Elegant TAG Heuer Carrera inspired timepiece with racing heritage and precision engineering. Perfect for motorsport enthusiasts.",
    images: [
      "https://lh3.googleusercontent.com/d/1_WbRoREnSIjitdS-IH68rvfOQi2e7HC7",
      "https://lh3.googleusercontent.com/d/1KqqdxeX922JWqDqd4is3cOGm0YL_LYGl",
      "https://lh3.googleusercontent.com/d/1A10bSK0ZzJxYKtzGZK_ksfTVC-sGlJP4"
    ]
  },
  {
    brand: "TISSOT",
    model: "PRX Powermatic 80",
    price: 850,
    previousPrice: 1308,
    description: "Tissot PRX Powermatic 80 - Quartz movement, Date window, Luminous hands, St steel back & Bfly lock. Elegant stainless-steel design with striking textured blue dial.",
    images: [
      "https://lh3.googleusercontent.com/d/1dLlvqriGpNGTTabspWW-DMUEJBypbumL",
      "https://lh3.googleusercontent.com/d/1RgxOLuRSu0Jt_O3Asp8IhctTOoLy6CTT",
      "https://lh3.googleusercontent.com/d/16Q6wvywlX1Y1J_bJJ5sRstS0lzq2QGj8",
      "https://lh3.googleusercontent.com/d/1xl8vSmiTkXHlaLISYtOoWnBt1V61eAZD"
    ]
  },
  {
    brand: "TOMMY HILFIGER",
    model: "Automatic Collection",
    price: 1500,
    previousPrice: 2308,
    description: "Tommy Hilfiger Automatic - 7AA Premium Collection, Working 24 Hour Analog, Stainless Steel Gold Body, full black, Transparent Front & Back, Pendulum Rotate charging, Fully Automatic self wind machine, No colour issue and rusting, metal Belt, Original Japanese Automatic Engine, 100% Satisfaction.",
    images: [
      "https://lh3.googleusercontent.com/d/1tYB8fMI9mwkDD76Am8SksN0BEfFFzKpW",
      "https://lh3.googleusercontent.com/d/1xErpEyN1Fn-JKnStQp53LaOa9LU6jO5q",
      "https://lh3.googleusercontent.com/d/1trfyBvtd1wnjfQcr3BG6Z0-1LMimwEgr",
      "https://lh3.googleusercontent.com/d/1CeCYmnRCPIvvl8NO0qReqp0Y_V-GV-_O",
      "https://lh3.googleusercontent.com/d/1wFC3smaBzbGFh5H35R2HEJmYB9QPqxVi",
      "https://lh3.googleusercontent.com/d/1ycgwBVqR9EvjeEk9UgNfQ4C4EORCr9G2",
      "https://lh3.googleusercontent.com/d/1yOTajH0bv_Gtuhxr7Qj-0TuwntNn8tvU",
      "https://lh3.googleusercontent.com/d/1XYfpwsAQwheFebJNxSlXvBPJ34eLv9Kv"
    ]
  }
];

async function uploadAllProducts() {
  console.log('🚀 Starting bulk product upload...');
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    console.log(`\n📦 Uploading ${i + 1}/${products.length}: ${product.brand} ${product.model}`);
    
    try {
      // Create product
      const productResponse = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin@walnut.com',
        },
        body: JSON.stringify({
          brand: product.brand,
          model: product.model,
          referenceNumber: `${product.brand}-${Date.now()}`,
          price: product.price,
          previousPrice: product.previousPrice,
          condition: 'NEW',
          year: 2024,
          gender: 'UNISEX',
          description: product.description,
          stockQuantity: 50,
          specifications: {
            case: 'Stainless Steel',
            bracelet: 'Stainless Steel',
            waterResistance: '50m',
            diameter: '42mm'
          },
          authenticity: {
            guaranteed: true
          }
        }),
      });

      if (!productResponse.ok) {
        throw new Error(`Product creation failed: ${productResponse.statusText}`);
      }

      const createdProduct = await productResponse.json();
      console.log(`✅ Product created: ${createdProduct.id}`);

      // Add images
      for (let j = 0; j < product.images.length; j++) {
        const imageUrl = product.images[j];
        const imageResponse = await fetch(`http://localhost:3000/api/products/${createdProduct.id}/images`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer admin@walnut.com',
          },
          body: JSON.stringify({
            imageUrl: imageUrl,
            altText: `${product.brand} ${product.model} - Image ${j + 1}`,
            isPrimary: j === 0,
            sortOrder: j + 1
          }),
        });

        if (imageResponse.ok) {
          console.log(`✅ Image ${j + 1} added`);
        } else {
          console.log(`❌ Image ${j + 1} failed`);
        }
      }

      console.log(`🎉 ${product.brand} ${product.model} uploaded successfully!`);

    } catch (error) {
      console.error(`❌ Error uploading ${product.brand} ${product.model}:`, error.message);
    }
  }

  console.log('\n🎊 Bulk upload completed!');
}

// Run the upload
uploadAllProducts().catch(console.error);
