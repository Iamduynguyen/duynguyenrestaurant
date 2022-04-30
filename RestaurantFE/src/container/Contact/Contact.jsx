import React, { Suspense } from "react";
import { BsChevronRight } from "react-icons/bs";
import { BiMessageDetail } from "react-icons/bi";
import Map from "./Map";
import "./contact.css";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import SubHeading from "../../components/SubHeading/SubHeading";

const Contact = () => {
  const key = "AIzaSyDmURiAY-xaUrlvv-L1ARH3_37I-vIxLzI";

  return (
    <div className="contact mb-[60px]">
      <div className="contact__banner">
        <div className="contact__banner--inner">
          <div className="contact__banner--title">Contact us</div>
          <div className="contact__banner--action">
            <div className="contact__banner--action__hom e">
              <Link to="/">Home</Link>
            </div>
            <div className="contact__banner--action__icon">
              <BsChevronRight />
            </div>
            <div className="contact__banner--action__location">Contact us</div>
          </div>
        </div>
      </div>
      <div className=" px-[30px] max-w-[1280px] py-[50px] mx-auto md:grid md:grid-cols-[60%,40%]">
        <div className="text-left">
          <SubHeading
            classText="text-xl font-medium text-black "
            title="Chef's word"
          />
          <p className="text-[#FACE3B] text-[40px] italic mt-[-10px]">
            Write Us A Message
          </p>
          <form
            action=""
            className="w-full md:pr-[30px] lg:pr-[140px] mt-[40px]"
          >
            <input
              type="text"
              className="border border-[#FACE3B] w-full text-[14px] px-[20px] py-[15px] focus:outline-none text-black"
              placeholder="Your Name"
            />
            <input
              type="text"
              className="mt-[30px] border border-[#FACE3B] w-full text-[14px] px-[20px] py-[15px] focus:outline-none text-black"
              placeholder="Enter Email"
            />
            <textarea
              type="text"
              className="mt-[30px] border border-[#FACE3B] w-full text-[14px] px-[20px] py-[15px] focus:outline-none text-black"
              placeholder="Your Massage"
              rows="5"
              //   col="5"
            />
            <button className="text-black bg-[#dcca87] mt-[30px] px-[35px] py-[15px]">
              Submit
            </button>
          </form>
        </div>
        <div className="hidden md:block lg:w-full md:w-[300px] lg:h-[550px] border-2 border-[#FACE3B] p-[1px] overflow-hidden">
          <img
            src="https://biryanimaxx.com/wp-content/uploads/2022/03/Biyanimax6.jpg"
            alt=""
            className="md:w-[150%] lg:w-[110%]"
            style={{ maxWidth: "150%" }}
          />
        </div>
      </div>
      <div className="contact__detail">
        <div className="contact__detail--map">
          <div className="contact__detail--map__content">
            <Map
              googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`}
              loadingElement={<div className="h-[300px] lg:h-[600px]" />}
              containerElement={<div style={{ height: "600px" }} />}
              mapElement={<div className="h-[300px] lg:h-[520px]" />}
            />
          </div>
        </div>
        <div className="contact__detail--time">
          <div className="contact__detail--time__title">
            <h4 className="text-[#FACE3B] font-medium">open time</h4>
          </div>
          <div className="contact__detail--time__detail">
            <table class="op-table op-table-overview">
              <tbody>
                <tr class="op-row op-row-day ">
                  <th class="op-cell op-cell-heading" scope="row">
                    Monday
                  </th>
                  <td class="op-cell op-cell-periods">
                    <span class="op-period-time ">11:30 am – 2:30 pm</span>
                    <br />
                    <span class="op-period-time ">5:00 pm – 9:30 pm</span>
                  </td>
                </tr>
                <tr class="op-row op-row-day ">
                  <th class="op-cell op-cell-heading" scope="row">
                    Tuesday
                  </th>
                  <td class="op-cell op-cell-periods">
                    <span class="op-closed">Closed</span>
                  </td>
                </tr>
                <tr class="op-row op-row-day ">
                  <th class="op-cell op-cell-heading" scope="row">
                    Wednesday
                  </th>
                  <td class="op-cell op-cell-periods">
                    <span class="op-period-time ">11:30 am – 2:30 pm</span>
                    <br />
                    <span class="op-period-time ">5:00 pm – 9:30 pm</span>
                  </td>
                </tr>
                <tr class="op-row op-row-day ">
                  <th class="op-cell op-cell-heading" scope="row">
                    Thursday
                  </th>
                  <td class="op-cell op-cell-periods">
                    <span class="op-period-time ">11:30 am – 2:30 pm</span>
                    <br />
                    <span class="op-period-time ">5:00 pm – 9:30 pm</span>
                  </td>
                </tr>
                <tr class="op-row op-row-day ">
                  <th class="op-cell op-cell-heading" scope="row">
                    Friday
                  </th>
                  <td class="op-cell op-cell-periods">
                    <span class="op-period-time ">11:30 am – 2:30 pm</span>
                    <br />
                    <span class="op-period-time ">5:00 pm – 10:30 pm</span>
                  </td>
                </tr>
                <tr class="op-row op-row-day ">
                  <th class="op-cell op-cell-heading" scope="row">
                    Saturday
                  </th>
                  <td class="op-cell op-cell-periods">
                    <span class="op-period-time ">11:30 am – 3:30 pm</span>
                    <br />
                    <span class="op-period-time ">5:30 pm – 10:30 pm</span>
                  </td>
                </tr>
                <tr class="op-row op-row-day ">
                  <th class="op-cell op-cell-heading" scope="row">
                    Sunday
                  </th>
                  <td class="op-cell op-cell-periods">
                    <span class="op-period-time ">11:30 am – 3:30 pm</span>
                    <br />
                    <span class="op-period-time ">5:30 pm – 10:30 pm</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
