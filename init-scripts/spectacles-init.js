db = db.getSiblingDB("spectacles");

db.screeningrooms.insertMany([
    {
        roomNumber: 1,
        rows: 8,
        seats_in_row: 10,
    },
    {
        roomNumber: 2,
        rows: 8,
        seats_in_row: 10,
    },
    {
        roomNumber: 3,
        rows: 12,
        seats_in_row: 8,
    },
    {
        roomNumber: 4,
        rows: 10,
        seats_in_row: 10,
    },
])