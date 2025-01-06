'use client';

import { useEffect, useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type DataSkillModifiers = {  
  ID: string;
  Effect: string;
  Description: string;
  "Mechanic Description": string;
  Modifier: string;
  Scaling: string;
  Unlocked: string;
};

type ScalingData = {
  ID: string;
  Modifier: string;
  Damage: string;
  Walking: string;
  DOT: string;
  AC: string;
};

function TableSkillsModifiers() {
  const [items, setItems] = useState<DataSkillModifiers[]>([]);
  const [scalingData, setScalingData] = useState<ScalingData[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<DataSkillModifiers | null>(null);
  const [showScalingModal, setShowScalingModal] = useState<boolean>(false);
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(false);

  const filteredItems = useMemo(() => {
    if (!filter) return items;
    return items.filter(item =>
      item.Effect.toLowerCase().includes(filter.toLowerCase()) ||
      item.Description.toLowerCase().includes(filter.toLowerCase()) ||
      item['Mechanic Description'].toLowerCase().includes(filter.toLowerCase()) ||
      item.Unlocked.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/json/Skills Modifier.json`);
        const jsonData = await response.json();
        const formattedData = jsonData.data.map((item: any) => ({          
          ID: item.ID,
          Effect: item.Effect,
          Description: item.Description,
          "Mechanic Description": item["Mechanic Description"],
          Modifier: item.Modifier,
          Scaling: item.Scaling,
          Unlocked: item.Unlocked,
        }));
        setItems(formattedData);
        // Default to showing the first item only on larger devices
        if (jsonData.data.length > 0 && isLargeScreen) {
          setSelectedItem(formattedData[0]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    async function fetchScalingData() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/json/Scaling.json`);
        const jsonData = await response.json();
        setScalingData(jsonData.data);
      } catch (error) {
        console.error('Error fetching scaling data:', error);
      }
    }

    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    fetchData();
    fetchScalingData();
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isLargeScreen]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Filter by Effect, Description, or Mechanic Description"
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
                <TableHead>Effect</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Initial Modifier</TableHead>
                <TableHead>Unlocked</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item: DataSkillModifiers) => (
                <TableRow
                  key={item.ID}
                  onClick={() => setSelectedItem(item)}
                  className="cursor-pointer hover:bg-gray-500"
                >
                  <TableCell>{item.Effect}</TableCell>
                  <TableCell>{item.Description}</TableCell>
                  <TableCell>{item.Modifier}</TableCell>
                  <TableCell>{item.Unlocked}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Card for Selected Item */}
        {selectedItem && (
          <Card className="w-full p-4 shadow-lg lg:relative lg:w-1/3">
            <CardHeader>
              <div className="mb-4 flex items-center justify-between">                    
                <CardTitle>{selectedItem.Effect}</CardTitle>              
                <Button className="lg:hidden" onClick={() => setSelectedItem(null)}>Close</Button>
              </div>
              <CardDescription>{selectedItem.Description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Mechanic Description:</strong> {selectedItem['Mechanic Description']}
              </p>
              <p>
                <strong>Scaling:</strong> <Button onClick={() => setShowScalingModal(true)}>View Scaling</Button>
              </p>
            </CardContent>

            {/* Scaling Modal */}
            {showScalingModal && (
              <div className="flex items-center justify-center ">
                <div className="w-11/12 max-w-3xl rounded-lg p-4 shadow-lg">
                  <div className="mb-4 flex justify-between">
                    <h2 className="text-xl font-bold">Scaling Data</h2>
                    <Button onClick={() => setShowScalingModal(false)}>Close</Button>
                  </div>                  
                  <Table className="w-full table-auto">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Modifier</TableHead>
                        <TableHead>Damage</TableHead>
                        <TableHead>Walking</TableHead>
                        <TableHead>DOT</TableHead>
                        <TableHead>AC</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scalingData.map((scaling: ScalingData) => (
                        <TableRow key={scaling.ID}>
                          <TableCell>+{scaling.Modifier}</TableCell>
                          <TableCell>{scaling.Damage}</TableCell>
                          <TableCell>{scaling.Walking}</TableCell>
                          <TableCell>{scaling.DOT}</TableCell>
                          <TableCell>{scaling.AC}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

export default TableSkillsModifiers;
