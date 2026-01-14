"use client";

import React, { useMemo, useRef, useState } from "react";
import HTMLFlipBookImport from "react-pageflip";
import type { PageItem } from "../data/pages";

// react-pageflip typings มัก strict เกินจริง → cast เป็น any เพื่อไม่ให้ TS บังคับ props แปลก ๆ
const HTMLFlipBook = HTMLFlipBookImport as unknown as React.ComponentType<any>;

type Props = { items: PageItem[] };

/* --------------------------------
 * Page (รูป + caption)
 * -------------------------------- */
type PageProps = { item: PageItem };

const Page = React.forwardRef<HTMLDivElement, PageProps>(({ item }, ref) => (
  <div ref={ref} className="page bg-white" style={{ width: 360, height: 520 }}>
    <div className="p-4">
      <div className="h-[420px] w-full rounded-xl overflow-hidden bg-neutral-200">
        <img
          src={item.src}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          alt=""
        />
      </div>

      <div className="mt-2 text-xs text-neutral-500">{item.date}</div>
      <div className="text-sm text-neutral-800">{item.caption}</div>
    </div>
  </div>
));
Page.displayName = "Page";

/* --------------------------------
 * Cover (ฟิล์มเก่า + minimal)
 * -------------------------------- */
type CoverProps = { title: string };

const Cover = React.forwardRef<HTMLDivElement, CoverProps>(({ title }, ref) => (
  <div
    ref={ref}
    className="page relative bg-neutral-950 text-white overflow-hidden film-grain film-vignette"
    style={{ width: 360, height: 520 }}
  >
    <div className="film-scratch" />

    <div className="absolute top-5 left-0 right-0 text-center">
      <div className="body-film-min text-[10px] opacity-60">
        anniversary edition
      </div>
    </div>

    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
      <h1 className="title-film-min text-[20px] leading-tight">{title}</h1>
      <div className="mt-5 w-14 h-[1px] bg-white/25" />
      <div className="mt-4 body-film-min text-[10px] opacity-55">since 2024</div>
    </div>

    <div className="absolute bottom-4 left-4 body-film-min text-[10px] opacity-45">
      vol. 01
    </div>
    <div className="absolute bottom-4 right-4 body-film-min text-[10px] opacity-45">
      35mm
    </div>
  </div>
));
Cover.displayName = "Cover";

/* --------------------------------
 * Letter Page (จดหมาย)
 * -------------------------------- */
const LetterPage = React.forwardRef<HTMLDivElement>((_, ref) => (
  <div
    ref={ref}
    className="page bg-[#f8f6f2] text-neutral-800"
    style={{ width: 360, height: 520 }}
  >
    <div className="p-8 text-sm leading-relaxed font-light">
      <p className="mb-4">ถึง ดญ.ออมสิน,</p>

      <p className="mb-4">
        หนึ่งปีที่ผ่านมา เราผ่านอะไรด้วยกันเยอะมาก รูปพวกนี้อาจไม่สวยที่สุด
        แต่ทุกภาพคือความทรงจำที่ผ่านมาด้วยกัน ทั้งวันที่ดีและวันที่แย่
        ขอบคุณที่อยู่ข้าง ๆ กันเสมอมา
      </p>

      <p>ขอบคุณที่อยู่ด้วยกัน 🤍</p>

      <div className="mt-10 text-xs opacity-60">— จาก STP, 19 มกราคม 2568</div>
    </div>
  </div>
));
LetterPage.displayName = "LetterPage";

/* --------------------------------
 * Main Component
 * -------------------------------- */
export default function FlipBook({ items }: Props) {
  const bookRef = useRef<any>(null);

  // กันหน้าคี่ (pageflip ชอบจำนวนหน้าคู่)
  const pages = useMemo(() => {
    const cloned = [...items];
    if (cloned.length % 2 === 1) {
      cloned.push({ src: "/photos/placeholder.jpg", date: "", caption: "" });
    }
    return cloned;
  }, [items]);

  // ป้องกันกดรัวระหว่างกำลัง flip
  const [isFlipping, setIsFlipping] = useState(false);

  // ใช้จับว่าตอนนี้อยู่หน้าไหน (เพื่อโชว์ไอคอนเพลงเฉพาะหน้า Letter)
  const [pageIndex, setPageIndex] = useState(0);
  const showSongIcon = pageIndex === 1; // 0=Cover, 1=Letter

  const flipPrev = () => {
    if (isFlipping) return;
    const api = bookRef.current?.pageFlip?.();
    if (!api) return;
    setIsFlipping(true);
    api.flipPrev();
  };

  const flipNext = () => {
    if (isFlipping) return;
    const api = bookRef.current?.pageFlip?.();
    if (!api) return;
    setIsFlipping(true);
    api.flipNext();
  };

  return (
    <div className="flex flex-col items-center relative">
      {/* Book */}
      <div style={{ width: 360, height: 520 }} className="relative">
        <HTMLFlipBook
          key={`book-${pages.length}`}
          ref={bookRef}
          width={360}
          height={520}

          /* สำคัญมาก */
          size="fixed"
          minWidth={360}
          maxWidth={360}
          minHeight={520}
          maxHeight={520}

          showCover={true}
          drawShadow={true}
          maxShadowOpacity={0.35}   // เพิ่มเงาให้รู้สึกเป็นกระดาษ
          showPageCorners={true}   // ⭐ มุมกระดาษงอ (สำคัญ)
          flippingTime={900}       // ⭐ ช้าลง = เหมือนเปิดสมุด
          swipeDistance={18}       // ลากนิดเดียวก็เปิด

          mobileScrollSupport={true}
          useMouseEvents={false}
          className="book"
          onFlip={(e: any) => {
            setIsFlipping(false);
            setPageIndex(e?.data ?? 0);
          }}
        >
          <Cover title="One Year on Film" />
          <LetterPage />

          {pages.map((p, i) => (
            <Page key={i} item={p} />
          ))}

          <Cover title="To be continued…" />
        </HTMLFlipBook>

       
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 mt-6">
        <button
          onClick={flipPrev}
          disabled={isFlipping}
          className="
            px-5 py-2 rounded-full
            bg-neutral-900 text-white
            text-sm tracking-wide
            opacity-90 transition
            active:scale-[0.98]
            disabled:opacity-40 disabled:cursor-not-allowed
          "
        >
          ← Prev
        </button>

        <button
          onClick={flipNext}
          disabled={isFlipping}
          className="
            px-5 py-2 rounded-full
            bg-neutral-900 text-white
            text-sm tracking-wide
            opacity-90 transition
            active:scale-[0.98]
            disabled:opacity-40 disabled:cursor-not-allowed
          "
        >
          Next →
        </button>
      </div>

      {/* Hint (optional) */}
      <div className="mt-2 text-[11px] opacity-50 tracking-wide">
        tap or swipe to turn the page
      </div>
    </div>
  );
}