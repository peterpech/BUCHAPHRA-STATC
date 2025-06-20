import { useState } from 'react'

export default function Lightbox({ src, alt, tokenId }: { src: string; alt: string; tokenId: number }) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <img src={src} alt={alt} onClick={() => setOpen(true)} className="cursor-pointer" />
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center" data-testid="lightbox">
          <img src={src} alt={alt} className="max-h-full" />
          <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-white">X</button>
        </div>
      )}
    </div>
  )
}
