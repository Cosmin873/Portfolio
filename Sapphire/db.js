export const products = {
  rings: [
    {
      title: "Bohemian Pursuit Three Diamond Ring",
      description:
        "With a bohemian flair, this petite ring designed with beaded bezels set with diamonds that is evenly spaces on top of the ring is a unique wedding ring to pair with your dainty engagement ring.",
      price: 310,
      url: [
        "./img/Products/bptdr/bptdryg.jpg",
        "./img/Products/bptdr/bptdrwg.jpg",
        "./img/Products/bptdr/bptdrrg.jpg",
      ],
      tag: null,
      material: ["yellow gold", "white gold", "rose gold"],
      gender: "women",
      occasion: ["casual"],
      code: "bptdr194",
    },
    {
      title: "Celestia Aquamarine Diamond Ring",
      description:
        "We designed the Celestia to be the perfect blend of sweet and minimal - matching the gemstones to the colors of fall with some rich oranges, reds, and more. Time to celebrate yourself or the one you love with this beautiful fall minimal ring.",
      price: 230,
      url: [
        "./img/Products/camdr/YGCA.jpg",
        "./img/Products/camdr/WGCA.jpg",
        "./img/Products/camdr/RGCA.jpg",
      ],
      tag: null,
      material: ["yellow gold", "white gold", "rose gold"],
      gender: "women",
      occasion: ["casual"],
      code: "cadr589",
    },
    {
      title: "Yours Truly Blue Sapphire Ring",
      description:
        "A dainty everyday essential to your lookbook. This stackable ring enhances your outfit from day to night. It is a gorgeous stackable ring that features five round blue sapphires evenly spaced out between open braids - a gift that you deserve",
      price: 219,
      url: [
        "./img/Products/ytbsr/ytbsryg.jpg",
        "./img/Products/ytbsr/ytbsrygwg.jpg",
        "./img/Products/ytbsr/ytbsrrg.jpg",
      ],
      tag: null,
      material: ["yellow gold", "white gold", "rose gold"],
      gender: "women",
      occasion: ["casual"],
      code: "ytbsr219",
    },
    {
      title: "Sequin Amethyst Ring",
      description:
        "A timeless, elegant and sophisticated accessory for any occasion. This ring is designed to draw attention and make a statement. Featuring our custom cut design, with a special way of mixing metallic sequins and gemstones to create a truly unique look every time it is worn",
      price: 260,
      url: [
        "./img/Products/sar/saryg.jpg",
        "./img/Products/sar/sarwg.jpg",
        "./img/Products/sar/sarrg.jpg",
      ],
      tag: null,
      material: ["yellow gold", "white gold", "rose gold"],
      gender: "women",
      occasion: ["casual"],
      code: "sar723",
    },
    {
      title: "Ruthie Tanzanite Bezel Ring",
      description:
        "This solitaire features an emerald-cut stone nestled in a sleek bezel setting that's equal parts protective and chic. Whether you're the type to wear it every single day or save it for moments that deserve a little extra sparkle, this ring is ready for whatever you throw at it. Classic, versatile, and undeniably lovely",
      price: 860,
      url: [
        "./img/Products/rtbr/rtbryg.jpg",
        "./img/Products/rtbr/rtbrwg.jpg",
        "./img/Products/rtbr/rtbrrg.jpg",
      ],
      tag: null,
      material: ["yellow gold", "white gold", "rose gold"],
      gender: "unisex",
      occasion: ["casual"],
      code: "rtbr174",
    },
  ],

  necklaces: [
    {
      title: "Necklace (Silver)",
      description: null,
      price: 49,
      url: "./img/cl2.jpg",
      tag: null,
      material: "gold",
      gender: "couple",
      occasion: "wedding",
    },
  ],

  createCode() {
    console.log(Math.random() * 10);
  },
};

export const categories = {
  ring: "./img/ring.jpg",
  necklace: "./img/necklace.jpg",
  bracelet: "./img/bracelet.jpg",
};

const emails = [];
