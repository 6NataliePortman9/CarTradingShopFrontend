import { API_BASE } from "../config/api";

const BASE_URL = `${API_BASE}/api/cars`;

export async function getCars() {

    const token = localStorage.getItem("token");

    const response = await fetch(BASE_URL, {

        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to load cars");
    }

    return await response.json();
}

export async function getCarById(id) {

    const response = await fetch(`${BASE_URL}/${id}`);

    if (!response.ok) {
        throw new Error("Failed to load car");
    }

    return await response.json();
}

export async function createCar(carData) {

    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("CarName", carData.carName);
    formData.append("CarMarka", carData.carMarka);
    formData.append("CarPrice", carData.carPrice);

    formData.append("YearOfIssue", carData.yearOfIssue);

    formData.append("CarCondition", carData.carCondition);

    formData.append("CarLocation", carData.carLocation);

    formData.append("CarGearBox", carData.carGearBox);

    formData.append(
        "CarOwnerTelephoneNumber",
        carData.carOwnerTelephoneNumber
    );

    formData.append("CarNumber", carData.carNumber);

    formData.append("CarStatus", carData.carStatus);

    // FILES
    if (carData.images && carData.images.length > 0) {

        carData.images.forEach(image => {

            formData.append("CarImages", image);
        });
    }

    const response = await fetch(
        `${BASE_URL}`,
        {
            method: "POST",

            headers: {
                Authorization: `Bearer ${token}`
            },

            body: formData
        }
    );

    if (!response.ok) {

        const errorText = await response.text();

        let errorMessage = "Failed to create car";

        try {

            const errorJson = JSON.parse(errorText);

            errorMessage =
                errorJson.error ||
                errorJson.title ||
                errorText;

        } catch {
            errorMessage = errorText;
        }

        throw new Error(errorMessage);
    }

    return await response.json();
}

export async function updateCar(id, carData) {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("CarName", carData.carName);
    formData.append("CarMarka", carData.carMarka);
    formData.append("CarPrice", carData.carPrice);
    formData.append("YearOfIssue", carData.yearOfIssue);
    formData.append("CarCondition", carData.carCondition);
    formData.append("CarGearBox", carData.carGearBox);
    formData.append("CarLocation", carData.carLocation);
    formData.append("CarOwnerTelephoneNumber", carData.carOwnerTelephoneNumber);
    formData.append("CarNumber", carData.carNumber);

    if (carData.carStatus !== undefined && carData.carStatus !== null) {
        formData.append("CarStatus", carData.carStatus);
    }

    if (carData.images && carData.images.length > 0) {
        carData.images.forEach(image => {
            formData.append("CarImages", image);
        });
    }

    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`
            // Content-Type НЕ встановлюємо — браузер сам додає boundary для FormData
        },
        body: formData
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to update car");
    }
}


export async function deleteCar(id) {

    const token = localStorage.getItem("token");

    const response = await fetch(`${BASE_URL}/${id}`, {

        method: "DELETE",

        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to delete car");
    }
}

export async function SearchCars(search) {

    const token = localStorage.getItem("token");

    const response = await fetch(`${BASE_URL}/search`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },

        body: JSON.stringify(search)
    });

    if (!response.ok) {
        throw new Error("Failed to search cars");
    }

    return await response.json();
}
