'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createSwapy, utils, SlotItemMapArray, Swapy } from 'swapy';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

type DataSkillModifiers = {  
  id: string;
  Effect: string;
  Description: string;
  "Mechanic Description": string;
  Modifier: string;
  Scaling: string;
  Unlocked: string;
};

function DragAndDropSkillsModifiers() {
  const [items, setItems] = useState<DataSkillModifiers[]>([]);
  const [slotItemMap, setSlotItemMap] = useState<SlotItemMapArray>([]);
  const [filter, setFilter] = useState<string>(''); // Filter state

  const filteredItems = useMemo(() => {
    if (!filter) return items; // No filter applied
    return items.filter(item =>
      item.Effect.toLowerCase().includes(filter.toLowerCase()) ||
      item.Description.toLowerCase().includes(filter.toLowerCase()) ||
      item['Mechanic Description'].toLowerCase().includes(filter.toLowerCase()) ||
      item.Unlocked.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);

  const filteredSlotItemMap = useMemo(() => {
    const filteredIds = new Set(filteredItems.map(item => item.id));
    return slotItemMap.filter(({ item }) => filteredIds.has(item));
  }, [filteredItems, slotItemMap]);

  const slottedItems = useMemo(() => {
    return utils.toSlottedItems(filteredItems, 'id', filteredSlotItemMap);
  }, [filteredItems, filteredSlotItemMap]);

  const swapyRef = useRef<Swapy | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/json/Skills Modifier.json');
        const jsonData = await response.json();
        const formattedData = jsonData.data.map((item: any) => ({          
          id: item.ID,
          Effect: item.Effect,
          Description: item.Description,
          "Mechanic Description": item["Mechanic Description"],
          Modifier: item.Modifier,
          Scaling: item.Scaling,
          Unlocked: item.Unlocked,
        }));
        setItems(formattedData);
        setSlotItemMap(utils.initSlotItemMap(formattedData, 'id'));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    swapyRef.current = createSwapy(containerRef.current!, {
      manualSwap: true,
      animation: 'spring',
      autoScrollOnDrag: true,
      swapMode: 'drop',
    });
  
    swapyRef.current.onSwap((event) => {
      const newMap = event.newSlotItemMap.asArray;
  
      // Update the full slotItemMap, preserving unfiltered items
      setSlotItemMap((prev) =>
        prev.map((slot) => {
          const updatedSlot = newMap.find((updated) => updated.slot === slot.slot);
          return updatedSlot || slot; // Retain unmodified slots
        })
      );
    });
  
    return () => {
      swapyRef.current?.destroy();
    };
  }, [items]);
  

  return (
    // <div className='container mx-auto p-4'>
    //   <div className="mb-4 flex justify-center">
    //     <input
    //       type="text"
    //       placeholder="Filter by Effect, Description, or Mechanic Description"
    //       className="w-full rounded border p-3"
    //       value={filter}
    //       onChange={(e) => setFilter(e.target.value)}
    //     />
    //   </div>

      <div className="container" ref={containerRef}>
        <div className="items grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {slottedItems.map(({ slotId, itemId, item }: { slotId: string; itemId: string; item: DataSkillModifiers | null }) => (
            <div className="slot" key={slotId} data-swapy-slot={slotId}>
              {item && (
                <Card className="item" data-swapy-item={itemId} key={itemId}>
                  <CardHeader>
                    <CardTitle>{item.Effect}</CardTitle>
                    <CardDescription>{item.Description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p><strong>Mechanic:</strong> {item["Mechanic Description"]}</p>
                    <p><strong>Initial Modifier:</strong> {item.Modifier}</p>
                    <p><strong>Scaling:</strong> {item.Scaling}</p>
                    <p><strong>Unlocked:</strong> {item.Unlocked}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </div>
      </div>
  );
}

export default DragAndDropSkillsModifiers;
