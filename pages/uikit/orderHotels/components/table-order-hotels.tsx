import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Image } from 'primereact/image';
import React, { useState } from 'react'
import { db } from '../../../api/firebase';
import { Tag } from 'primereact/tag';
import axios from 'axios';

const TableOrderHotels: React.FC<{ orders: any }> = ({ orders }) => {
  const [loading, setLoading] = useState(false)

  const CancelOrder = async (orderId: string, usersId: string) => {
    try {
      setLoading(true);
      await axios.post(`https://app.nativenotify.com/api/indie/notification`, {
        subID: usersId,
        appId: 8562,
        appToken: 'c50yB7EcbMr6VOtSVF0qNb',
        title: 'ยกเลิกสำเร็จ',
        message: `คำสั่งซื้อ${orderId}`,
        bigPictureURL: "enter image"
      });

      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: "Failed" });
      console.log('Trip removed successfully!');
      window.location.reload();
    } catch (error) {
      console.log('Error removing trip:', error);
    } finally {
      setLoading(false);
    }
  };

  const DeleteOrder = async (orderId: any) => {
    try {
      setLoading(true);
      const orderRef = doc(db, 'orders', orderId);
      await deleteDoc(orderRef);
      console.log('Trip removed successfully!');
      window.location.reload();
    } catch (error) {
      console.log('Error removing trip:', error);
    } finally {
      setLoading(false);
    }
  };

  const enterOrder = async (orderId: string, usersId: string) => {
    try {
      setLoading(true);
      await axios.post(`https://app.nativenotify.com/api/indie/notification`, {
        subID: usersId,
        appId: 8562,
        appToken: 'c50yB7EcbMr6VOtSVF0qNb',
        title: 'สั่งซื้อสำเร็จ',
        message: `คำสั่งซื้อ${orderId}`,
        bigPictureURL: "enter image"
      });

      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: "Success" });
      window.location.reload();
    } catch (error) {
      console.log('Error trip:', error);
    }
  }

  return (
    <>
      <DataTable value={orders} showGridlines dataKey="id"  >
        <Column field="orderID" header="รหัสคำสั่งชื้อ" style={{ minWidth: '12rem', textAlign: 'center' }} body={(rowData) => <div className="line-clamp-1" >{rowData.orderID}</div>}></Column>
        <Column field="title" header="แพ็คเกจ" style={{ minWidth: '12rem', textAlign: 'center' }} body={(rowData) => <div className="line-clamp-2 w-12rem">{rowData.title}</div>} ></Column>
        <Column field="type" header="หมวดหมู่" style={{ minWidth: '8rem', textAlign: 'center' }} body={(rowData) => <div className="line-clamp-2 w-8rem">{rowData.type === 'PLACE' ? ('ทัวร์') : ('โรงแรม')}</div>}></Column>
        <Column field="price" header="ราคา" style={{ minWidth: '10rem', textAlign: 'center' }}></Column>
        <Column field="fistname" header="ชื่อ" style={{ minWidth: '10rem', textAlign: 'center' }}></Column>
        <Column field="lastname" header="นามสกุล" style={{ minWidth: '10rem', textAlign: 'center' }}></Column>
        <Column field="phonnumber" header="เบอร์โทรศัพท์" style={{ minWidth: '10rem', textAlign: 'center' }}></Column>
        <Column field="email" header="อีเมล" style={{ minWidth: '10rem', textAlign: 'center' }}></Column>
        <Column field="checkInDate" header="วันที่เช็คอิน" style={{ minWidth: '6rem', textAlign: 'center' }}></Column>
        <Column field="checkOutDate" header="วันที่เช็คเอาท์" style={{ minWidth: '6rem', textAlign: 'center' }}></Column>
        <Column field="selectRoom" header="ประเภทห้อง" style={{ textAlign: 'center' }} body={(rowData) => <div className="line-clamp-2 w-8rem">{rowData.selectRoom}</div>}></Column>
        <Column
          field=""
          header="สลีป"
          style={{ minWidth: '10rem', textAlign: 'center' }}
          body={(rowData) => <div className="">
            <Image
              src={rowData.sleep_checkout} alt="Image"
              width="60"
              preview />
          </div>}
        >
        </Column>
        <Column
          field="status"
          header="สถานะ"

          style={{ minWidth: '6rem', textAlign: 'center' }}
          body={(rowData) =>
            <div className="w-6rem">
              <Tag severity={rowData.status === 'InProgress' ? 'warning' : rowData.status === 'Success' ? 'success' : "danger"} value={rowData.status}></Tag>
            </div>}>

        </Column>

        <Column field="note" header="หมายเหตุ" style={{ minWidth: '12rem', textAlign: 'center' }} body={(rowData) => <div className="line-clamp-2 w-12rem">{rowData.note}</div>} ></Column>

        <Column
          field="status"
          header="#"
          style={{ minWidth: '6rem', textAlign: 'center' }}
          body={(rowData) => (
            <div className="">
              {rowData.status !== 'Success' && rowData.status !== 'Failed' ?
                <Button
                  label="ยืนยัน"
                  severity="success"
                  size="small"
                  style={{ fontSize: 12, padding: 3 }}
                  onClick={() => enterOrder(rowData.id, rowData.usersId)}
                /> : ''
              }
            </div>
          )
          }>
        </Column>
        <Column
          field="status"
          header="#"
          style={{ minWidth: '6rem', textAlign: 'center' }}
          body={(rowData: any) => (
            <div className="">
              {rowData.status !== 'Success' && rowData.status !== 'Failed' ?
                <Button
                  label="ยกเลิก"
                  severity="danger"
                  size="small"
                  style={{ fontSize: 12, padding: 3 }}
                  onClick={(e) => { e.preventDefault; CancelOrder(rowData.id, rowData.usersId) }} /> : <Button
                  icon="pi pi-trash"
                  severity="danger"
                  rounded
                  onClick={(e) => { e.preventDefault; DeleteOrder(rowData.id) }} />
              }
            </div>
          )
          }>
        </Column>
      </DataTable>
    </>
  )
}

export default TableOrderHotels