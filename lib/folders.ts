export type Folder = {
  id: string;
  title: string;
  x: number;
  y: number;
  // for image-based folders
  images?: string[];
  slideshowType?: "fade" | "slide" | "stack";
  // for text-only folders
  text?: string;
  // for video folder
  video?: string;
  // optional custom icon (for desktop thumbnail)
  icon?: string;
};

export const FOLDERS: Folder[] = [
  {
    id: "bhootagaanam",
    title: "Bhootagaanam [Theatre]",
    x: 120,
    y: 70,
    images: [
      "/images/bhootaganam/1.jpg",
      "/images/bhootaganam/2.jpg",
      "/images/bhootaganam/3.jpg",
      "/images/bhootaganam/4.jpg",
      "/images/bhootaganam/5.jpg",
      "/images/bhootaganam/6.jpg",
      "/images/bhootaganam/7.jpg",
      "/images/bhootaganam/8.jpg",
      "/images/bhootaganam/9.jpg",
      "/images/bhootaganam/10.jpg",
      "/images/bhootaganam/11.jpg",
    ],
    slideshowType: "fade",
  },
  {
    id: "bhaag-kodaka",
    title: "Bhaag Kodaka Bhaag [Theatre]",
    x: 120,
    y: 190,
    images: [
      "/images/bkb/1.jpg",
      "/images/bkb/2.jpg",
      "/images/bkb/3.jpg",
      "/images/bkb/4.jpg",
      "/images/bkb/5.jpg",
      "/images/bkb/6.jpg",
      "/images/bkb/7.jpg",
    ],
    slideshowType: "slide",
  },
  {
    id: "green-screen",
    title: "Green Screen",
    x: 120,
    y: 310,
    images: [
      "/images/green/1.jpg",
      "/images/green/2.jpg",
      "/images/green/3.jpg",
      "/images/green/4.jpg",
      "/images/green/5.jpg",
      "/images/green/6.jpg",
      "/images/green/7.jpg",
      "/images/green/8.jpg",
      "/images/green/9.jpg",
    ],
    slideshowType: "stack",
  },
  {
    id: "just-like-that",
    title: "Just Like That",
    x: 330,
    y: 90,
    images: [
      "/images/just/1.jpg",
      "/images/just/2.jpg",
      "/images/just/3.jpg",
      "/images/just/4.jpg",
      "/images/just/5.jpg",
      "/images/just/6.jpg",
      "/images/just/7.jpg",
      "/images/just/8.jpg",
    ],
    slideshowType: "fade",
  },
  {
    id: "about-me",
    title: "About Me",
    x: 520,
    y: 110,
    text: "I'm Shiva Pranav, an actor who found his way back to life through theatre. At a time when everything felt dim, the stage was a ray of sunshine, I still remember deciding, during one ordinary sunset, that this is what I'm going to do. Since then, the actor in me hasn't gone quiet, and it won't. I love becoming someone else, not for show, but to see how deeply I can blend into a character; big role, small role, it doesn't matter. I believe I have it in me to do whatever it takes. You'll know the rest when we work together. 😉",
    icon: "/images/about.jpg",
  },
  {
    id: "showreel",
    title: "Showreel",
    x: 520,
    y: 220,
    video: "/videos/showreel.mp4",
    icon: "/images/showr.jpg",
  },
];
