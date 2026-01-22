'use client'

import { gsap } from 'gsap'
import React, { useEffect, useRef } from 'react'

const Loading = () => {
  function randomColor(plightness: number) {
    const hue = Math.floor(Math.random() * 360)
    const lightness = plightness + Math.random() * 10
    return `hsl(${hue}, 100%, ${lightness}%)`
  }

  const spinnerRef = useRef<HTMLDivElement | null>(null)
  const charsRef = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    if (spinnerRef.current) {
      gsap.to(spinnerRef.current, {
        rotate: 360,
        duration: 1,
        ease: 'linear',
        repeat: -1,
      })
    }

    if (spinnerRef.current) {
      spinnerRef.current.style.borderTopColor = randomColor(50)
    }

    function animateBorderColor() {
      if (!spinnerRef.current) return
      gsap.to(spinnerRef.current, {
        borderTopColor: randomColor(50),
        duration: 0.8,
        ease: 'none',
        onComplete: animateBorderColor,
      })
    }
    animateBorderColor()

    charsRef.current.forEach((char, i) => {
      if (!char) return
      char.style.color = randomColor(70)
      const tl = gsap.timeline({ repeat: -1, delay: i * 0.2 })
      tl.to(char, {
        color: () => randomColor(70),
        duration: 0.6,
        ease: 'sine.inOut',
      })
    })
  }, [])

  const text = 'Loading...'

  return (
    <div className='flex items-center justify-center w-screen h-screen bg-white text-gray-400 font-sans'>
      <div className='flex items-center gap-4'>
        <div
          ref={spinnerRef}
          className='w-12 h-12 border-4 border-gray-200 border-t-gray-300 rounded-full'
        ></div>
        <div className='flex text-6xl tracking-wider'>
          {text.split('').map((ch, i) => (
            <span
              key={i}
              ref={el => {
                charsRef.current[i] = el
              }}
              className='inline-block'
            >
              {ch}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Loading
