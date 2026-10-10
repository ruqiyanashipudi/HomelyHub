import {createSlice} from "@reduxjs/toolkit";
const initialState ={
    booking:[],
    bookingDetails:{},
    loading:false
}

const bookingSlice = createSlice({
    name:"booking",
    initialState,
    reducers:{
        setBookingRequest(state){
            state.loading=true;
        },

        setBooking(state,action){
            state.booking=action.payload;
            state.loading=false
        },


        addBooking:(state,action)=>{
            state.booking.push(action.payload);

        },
        setBookingDetails:(state,action)=>{
            state.bookingDetails = action.payload.bookings;

        }

    }
})
export const {setBookings,addBooking,setBookingDetails} =bookingSlice.actions;
export default bookingSlice;