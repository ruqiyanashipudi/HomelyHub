import { propertyAction } from "./property-slice";
import { axiosInstance } from "../../utils/axios";

export const getAllProperties = () => async (dispatch, getState) => {
    try {
        console.log("API call started");

        dispatch(propertyAction.getRequest())

        const { searchParams } = getState().properties;

        console.log(searchParams)

        const response = await axiosInstance.get("/v1/rent/listing", {
            params: { ...searchParams }
        })


        if(!response){
            throw new error("Could not fetch any properties")
        }

        console.log(response.data);

        dispatch(propertyAction.getProperties(response.data));

    } catch (error) {
        

        dispatch(propertyAction.getErrors(error.message));
    }
}