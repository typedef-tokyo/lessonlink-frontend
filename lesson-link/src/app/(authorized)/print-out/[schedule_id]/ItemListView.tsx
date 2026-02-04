'use client'

import { Table } from '@mantine/core'
import React from 'react'
import { PrintItem } from './_components/types'

type Props = {
  printData: Array<PrintItem>
  onPageBreak: boolean
}

export const ItemListView = ({ printData, onPageBreak }: Props) => {
  return (
    <>
      {onPageBreak && (
        <style>
          {`
          @media print {
            .print-section {
              page-break-before: always;
            }
          }
        `}
        </style>
      )}
      <div className='w-[80%] mx-auto'>
        {printData.map((data, index) => (
          <div key={index} className={onPageBreak ? 'print-section' : ''}>
            <div className='w-[100%] p-1'>
              <div className='w-[100%] flex justify-start'>{`${data.room_name}`}</div>

              <Table className='border border-gray-500 mt-1'>
                <Table.Thead>
                  <Table.Tr className='border-b border-gray-500'>
                    <Table.Th
                      className='w-[15%] bg-[#D9D9D9] text-center border border-black'
                      style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
                    >
                      時間
                    </Table.Th>
                    <Table.Th
                      className='w-[70%] bg-[#D9D9D9] text-center border border-black'
                      style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
                    >
                      講座
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {data.items.map(item => (
                    <Table.Tr key={item.uniq_id}>
                      <Table.Td className='border border-gray-500 items-center text-center'>
                        {`${item.start_time_hh.toString().padStart(2, '0')}:${item.start_time_mm.toString().padStart(2, '0')} ～ ${item.end_time_hh.toString().padStart(2, '0')}:${item.end_time_mm.toString().padStart(2, '0')}`}
                      </Table.Td>
                      <Table.Td className='border border-gray-500 items-center'>
                        {item.lesson_name}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
