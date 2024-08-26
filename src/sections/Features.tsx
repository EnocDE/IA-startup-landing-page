"use client";
import productImage from "@/assets/product-image.png";
import {
  DotLottieCommonPlayer,
  DotLottiePlayer,
} from "@dotlottie/react-player";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  ValueAnimationTransition,
} from "framer-motion";
import { ComponentPropsWithoutRef, useEffect, useRef, useState } from "react";

const tabs = [
  {
    icon: "/assets/lottie/vroom.lottie",
    title: "User-friendly dashboard",
    isNew: false,
    backgroundPositionX: 0,
    backgroundPositionY: 0,
    backgroundSizeX: 150,
  },
  {
    icon: "/assets/lottie/click.lottie",
    title: "One-click optimization",
    isNew: false,
    backgroundPositionX: 98,
    backgroundPositionY: 100,
    backgroundSizeX: 135,
  },
  {
    icon: "/assets/lottie/stars.lottie",
    title: "Smart keyword generator",
    isNew: true,
    backgroundPositionX: 100,
    backgroundPositionY: 27,
    backgroundSizeX: 177,
  },
];

const FeatureTab = (
  props: (typeof tabs)[number] &
    ComponentPropsWithoutRef<"div"> & { selected: boolean }
) => {
  const tabRef = useRef<HTMLDivElement>(null);
  const dotLottieRef = useRef<DotLottieCommonPlayer>(null);
  const xPercentage = useMotionValue(0);
  const yPercentage = useMotionValue(0);
  const maskImage = useMotionTemplate`radial-gradient(80px 80px at ${xPercentage}% ${yPercentage}%, black, transparent)`;

  useEffect(() => {
    if (!tabRef.current || !props.selected) return;
    xPercentage.set(0);
    yPercentage.set(0);
    const { height, width } = tabRef.current?.getBoundingClientRect();
    const circumference = height * 2 + width * 2;
    const times = [
      0,
      width / circumference,
      (width + height) / circumference,
      (width * 2 + height) / circumference,
      1,
    ];

    const options: ValueAnimationTransition = {
      duration: 4,
      repeat: Infinity,
      ease: "linear",
      repeatType: "loop",
      times,
    };
    animate(xPercentage, [0, 100, 100, 0, 0], options);
    animate(yPercentage, [0, 0, 100, 100, 0], options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selected]);

  const handleTabHover = () => {
    if (dotLottieRef.current === null) return;
    if (dotLottieRef.current.getState().currentState !== "playing") {
      dotLottieRef.current.seek(0);
      dotLottieRef.current.play();
    }
  };

  return (
    <div
      onClick={props.onClick}
      onMouseEnter={handleTabHover}
      className="border border-white/15 p-2.5 rounded-xl flex gap-2.5 items-center lg:flex-1 relative"
      ref={tabRef}
    >
      <AnimatePresence>
        {props.selected && (
          <motion.div
            className="absolute inset-0 -m-px border border-[#A369ff] rounded-xl"
            style={{
              maskImage,
            }}
            animate={{
              opacity: [0, 0.5, 1],
            }}
            exit={{
              opacity: [1, 0.5, 0],
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
          ></motion.div>
        )}
      </AnimatePresence>

      <div className="h-12 w-12 border border-white/15 rounded-lg inline-flex items-center justify-center">
        <DotLottiePlayer
          ref={dotLottieRef}
          src={props.icon}
          className="h-5 w-5"
          autoplay
        />
      </div>
      <div className="font-medium">{props.title}</div>
      {props.isNew && (
        <div className="text-xs rounded-full px-2 py-0.5 bg-[#8c44ff] text-black font-semibold">
          new
        </div>
      )}
    </div>
  );
};

export const Features = () => {
  const [selectedTab, setSelectedTab] = useState<null | number>(null);

  const backgroundPositionX = useMotionValue(
    tabs[selectedTab || 0].backgroundPositionX
  );
  const backgroundPositionY = useMotionValue(
    tabs[selectedTab || 0].backgroundPositionY
  );
  const backgroundSizeX = useMotionValue(
    tabs[selectedTab || 0].backgroundSizeX
  );

  const backgroundPosition = useMotionTemplate`${backgroundPositionX || 0}% ${
    backgroundPositionY || 0
  }%`;
  const backgroundSize = useMotionTemplate`${
    selectedTab === null ? 100 : backgroundSizeX
  }% auto`;

  const handleSelectedTab = (index: number) => {
    const options: ValueAnimationTransition = {
      duration: 1,
      ease: "easeInOut",
    };
    if (index !== selectedTab) {
      setSelectedTab(index);
      animate(
        backgroundSizeX,
        [
          selectedTab === null ? 100 : backgroundSizeX.get(),
          100,
          tabs[index].backgroundSizeX,
        ],
        options
      );
      animate(
        backgroundPositionX,
        [backgroundPositionX.get(), tabs[index].backgroundPositionX],
        options
      );
      animate(
        backgroundPositionY,
        [backgroundPositionY.get(), tabs[index].backgroundPositionY],
        options
      );
    }
  };

  return (
    <section className="py-20 md:py-24">
      <div className="container">
        <h2 className="text-5xl md:text-6xl font-medium text-center tracking-tighter">
          Elevate your SEO efforts.
        </h2>
        <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto tracking-tight text-center mt-5">
          From small startups to large enterprises, our AI-driven tool has
          revolutionized the way businesses approach SEO.
        </p>
        <div className="mt-10 flex flex-col lg:flex-row gap-3">
          {tabs.map((tab, tabIndex) => (
            <FeatureTab
              key={tab.title}
              {...tab}
              selected={selectedTab === tabIndex}
              onClick={() => handleSelectedTab(tabIndex)}
            />
          ))}
        </div>
        <div className="border border-white/20 p-2.5 rounded-xl mt-3">
          <motion.div
            className="aspect-video bg-cover border border-white/20 rounded-lg"
            style={{
              backgroundImage: `url(${productImage.src})`,
              backgroundPosition,
              backgroundSize,
            }}
          ></motion.div>
        </div>
      </div>
    </section>
  );
};
