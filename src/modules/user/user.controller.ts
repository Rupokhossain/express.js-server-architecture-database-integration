import type { Request, Response } from "express";
import { userService } from "./user.service";
import sendResponse from "../../utility/sendResponse";

const createUser = async (req: Request, res: Response) => {
  // const { name, email, password } = req.body;

  try {
    const result = await userService.createUserIntoDB(req.body);

   sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User Created successfully",
    data: result.rows[0]
   });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getUserIntoDB();

    res.status(200).json({
      success: true,
      message: "Users retrived successfully!",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userService.getSingleUserDB(id as string);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User Not found!",
        data: {},
      });
    }

    res.status(200).json({
      success: true,
      message: "User retrieved successfully!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {

    const result = await userService.updateUserDB(id as string, req.body);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User Not found!",
      });
    }

    // console.log(result)

    res.status(200).json({
      success: true,
      message: "User updated successfully!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};


const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
   
    const result = await userService.deleteUserDB(id as string);

    if(result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User Not Found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully!",
      data: {},
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
}

export const userController = {
  createUser,
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser
};
