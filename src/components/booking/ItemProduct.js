import React, { useEffect, useState } from "react";
import {
  InputNumber
} from "antd";
import { VND } from "../../constant";

const ItemProduct = ({val, handleOnChange, totalPrice}) =>{
    return (
        <div className="product" key={val?.id}>
        <div className="block_top" style={{width:"45%"}}>
          <img src="https://www.galaxycine.vn/media/2023/2/1/menuboard-combo1-2-2022-coonline-02_1675216316623.jpg"/>
          <div className="product_name">
              <p>{val?.productName}</p>
            
          </div>
        </div>
        <div style={{width:"20%", textAlign:"end"}} className="product_number">
            <InputNumber min={0} max={100000} defaultValue={0} onChange={(e)=> handleOnChange(e,val)} />
        </div>
        <p style={{width:"20%", textAlign:"end"}}>{VND.format(val?.price)}</p>
        <p style={{width:"15%", textAlign:"end"}}>{VND.format(totalPrice)}</p>
     </div>
    )
}

export default ItemProduct;