'use client';

import { useEffect, useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

function TablePlayerRanks() {
  interface SkillRank {
    ID: number;
    Rank: string;
    Description: string;
    "Modifier Slots": number;
  }

  const [items, setItems] = useState<SkillRank[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/json/Skills Rank.json')
        const jsonData = await response.json();
        interface SkillModifier {
            ID: number;
            Rank: string;
            Description: string;
            "Modifier Slots": number;
        }

        interface SkillModifierResponse {
            data: SkillModifier[];
        }

        const formattedData: SkillModifier[] = (jsonData as SkillModifierResponse).data.map((item) => ({
            ID: item.ID,
            Rank: item.Rank,
            Description: item.Description,
            "Modifier Slots": item["Modifier Slots"],
        }));
        setItems(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter(
      (item) =>
        item.Rank.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Filter by Rank"
          className="w-full rounded border p-3"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Table with Scroll */}
        <div className="max-h-[70vh] flex-1 overflow-y-auto">
          <Table className="w-full table-auto">
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Modifier Slots</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow
                  key={item.ID}
                  className="cursor-pointer hover:bg-gray-500"
                >
                  <TableCell>{item.Rank}</TableCell>
                  <TableCell>{item.Description}</TableCell>
                  <TableCell>{item["Modifier Slots"]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default TablePlayerRanks;
