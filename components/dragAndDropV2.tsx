'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createSwapy, utils, SlotItemMapArray, Swapy } from 'swapy'

type Item = {
  id: string
  title: string
}

const initialItems: Item[] = [
  { id: '1', title: '1' },
  { id: '2', title: '2' },
  { id: '3', title: '3' },
  { id: '4', title: '4' },
  { id: '5', title: '5' },
  { id: '6', title: '6' },
]

function DragAndDropV2() {
  const [items, setItems] = useState<Item[]>(initialItems)
  const [slotItemMap, setSlotItemMap] = useState<SlotItemMapArray>(utils.initSlotItemMap(items, 'id'))
  const slottedItems = useMemo(() => utils.toSlottedItems(items, 'id', slotItemMap), [items, slotItemMap])

  const swapyRef = useRef<Swapy | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const slotItemMapRef = useRef(utils.initSlotItemMap(items, 'id'));

  useEffect(() => {
    utils.dynamicSwapy(
      swapyRef.current,
      items,
      'id',
      slotItemMapRef.current,
      (newMap) => (slotItemMapRef.current = newMap)
    );
  }, [items]);


  useEffect(() => {
    swapyRef.current = createSwapy(containerRef.current!, {
      manualSwap: true,
      // animation: 'dynamic',
      // autoScrollOnDrag: true,
      // swapMode: 'drop',
      // enabled: true,
      // dragAxis: 'x',
      // dragOnHold: true
    })

    swapyRef.current.onSwap((event: { newSlotItemMap: { asArray: SlotItemMapArray } }) => {
      setSlotItemMap(event.newSlotItemMap.asArray)
    })
    
    swapyRef.current.onSwap((event) => { 
      setSlotItemMap(event.newSlotItemMap.asArray) 
    }) 
    return () => {
      swapyRef.current?.destroy()
    }
  }, [])
  return (
    <div className="container" ref={containerRef}>
      <div className="items">
        {slottedItems.map(({ slotId, itemId, item }: { slotId: string, itemId: string, item: Item | null }) => (
          <div className="slot" key={slotId} data-swapy-slot={slotId}>
            {item &&
              <div className="item" data-swapy-item={itemId} key={itemId}>
                <span>{item.title}</span>
              </div>
            }
          </div>
        ))}
      </div>
    </div>
  )
}

export default DragAndDropV2