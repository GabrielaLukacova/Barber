USE barberDB;


DROP VIEW IF EXISTS appointment_details_view;
DROP VIEW IF EXISTS shop_opening_hours;


DROP TABLE IF EXISTS AppointmentService;
DROP TABLE IF EXISTS Appointment;
DROP TABLE IF EXISTS TimeOff;
DROP TABLE IF EXISTS OpeningHours;
DROP TABLE IF EXISTS Service;
DROP TABLE IF EXISTS Client;
DROP TABLE IF EXISTS GalleryImage;
DROP TABLE IF EXISTS BarberShop;
DROP TABLE IF EXISTS PostalCode;

CREATE TABLE PostalCode (
    postalCode VARCHAR(4) NOT NULL PRIMARY KEY,
    city CHAR(20) NOT NULL
);

CREATE TABLE BarberShop (
    barberShopID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phoneNumber VARCHAR(15),
    email VARCHAR(100),
    street VARCHAR(100),
    postalCode VARCHAR(4),
    description TEXT,
    FOREIGN KEY (postalCode) REFERENCES PostalCode(postalCode)
);

CREATE TABLE GalleryImage (
    imageID INT AUTO_INCREMENT PRIMARY KEY,
    barberShopID INT NOT NULL,
    filePath VARCHAR(255) NOT NULL,
    sortOrder INT DEFAULT 0,
    FOREIGN KEY (barberShopID) REFERENCES BarberShop(barberShopID)
);

CREATE TABLE Client (
    clientID INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(15) NOT NULL,
    lastName VARCHAR(15) NOT NULL,
    email VARCHAR(50) NOT NULL,
    phoneNumber VARCHAR(15),
    note TEXT
);

CREATE TABLE Service (
    serviceID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    imagePath VARCHAR(255),
    duration INT NOT NULL,
    price INT NOT NULL,
    isBooked BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_service_name UNIQUE (name)
);

CREATE TABLE OpeningHours (
    openingHoursID INT AUTO_INCREMENT PRIMARY KEY,
    dayOfWeek VARCHAR(10) NOT NULL, 
    openingTime TIME,
    closingTime TIME
);

CREATE TABLE TimeOff (
    timeOffID INT AUTO_INCREMENT PRIMARY KEY,
    start DATETIME NOT NULL,
    end DATETIME NOT NULL,
    reason TEXT
);

CREATE TABLE Appointment (
    appointmentID INT AUTO_INCREMENT PRIMARY KEY,
    clientID INT,
    appointmentDate DATE NOT NULL,
    startTime TIME NOT NULL,
    endTime TIME NOT NULL,
    status ENUM('BOOKED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'BOOKED',
    totalPriceCents INT,
    FOREIGN KEY (clientID) REFERENCES Client(clientID)
);

CREATE TABLE AppointmentService (
    appointmentID INT,
    serviceID INT,
    price INT NOT NULL,     
    duration INT NOT NULL, 
    PRIMARY KEY (appointmentID, serviceID),
    FOREIGN KEY (appointmentID) REFERENCES Appointment(appointmentID) ON DELETE CASCADE,
    FOREIGN KEY (serviceID) REFERENCES Service(serviceID)
);




-- TEST DATA --

INSERT INTO Client (firstName, lastName, email, phoneNumber)
VALUES
('John', 'Doe', 'john.doe@example.com', '+123456789'),
('Emily', 'Clark', 'emily.clark@example.com', '+123450987'),
('Michael', 'Smith', 'michael.smith@example.com', '+198765432'),
('Sarah', 'Johnson', 'sarah.j@example.com', '+147852369'),
('David', 'Brown', 'david.brown@example.com', '+111222333');

INSERT INTO Service (name, duration, price)
VALUES
('Men Haircut', 30, 2500),
('Women Haircut', 45, 3500),
('Beard Trim', 15, 1500),
('Coloring', 90, 8000),
('Kids Cut', 20, 2000);

INSERT INTO OpeningHours (dayOfWeek, openingTime, closingTime)
VALUES
('Monday', '09:00:00', '18:00:00'),
('Tuesday', '09:00:00', '18:00:00'),
('Wednesday', '09:00:00', '18:00:00'),
('Thursday', '09:00:00', '18:00:00'),
('Friday', '09:00:00', '18:00:00'),
('Saturday', '10:00:00', '14:00:00'),
('Sunday', NULL, NULL);

INSERT INTO TimeOff (start, end, reason)
VALUES
('2025-12-24 10:00:00', '2025-12-24 16:00:00', 'Holiday break'),
('2025-12-31 15:00:00', '2025-12-31 20:00:00', 'New Year closing');


INSERT INTO Appointment (clientID, appointmentDate, startTime, endTime, status, totalPriceCents)
VALUES
(1, '2025-12-02', '10:00:00', '10:30:00', 'BOOKED', 2500),
(2, '2025-12-02', '11:00:00', '11:45:00', 'COMPLETED', 3500),
(3, '2025-12-03', '12:00:00', '12:15:00', 'BOOKED', 1500),
(4, '2025-12-03', '14:00:00', '15:30:00', 'BOOKED', 8000),
(5, '2025-12-04', '09:00:00', '09:20:00', 'CANCELLED', 2000);

INSERT INTO AppointmentService (appointmentID, serviceID, price, duration)
VALUES
(1, 1, 2500, 30),
(2, 2, 3500, 45),
(3, 3, 1500, 15),
(4, 4, 8000, 90),
(5, 5, 2000, 20);




-- VIEWS --

CREATE OR REPLACE VIEW shop_opening_hours AS
SELECT 
    oh.dayOfWeek,
    oh.openingTime,
    oh.closingTime
FROM OpeningHours oh
ORDER BY FIELD(oh.dayOfWeek, 'Monday', 'Tuesday', 
'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

CREATE OR REPLACE VIEW appointment_details_view AS
SELECT 
    a.appointmentID,
    a.appointmentDate,
    a.startTime,
    a.endTime,
    a.status,
    c.firstName AS clientFirstName,
    c.lastName AS clientLastName,
    c.email AS clientEmail,
    c.phoneNumber AS clientPhone,
    a.totalPriceCents,
    GROUP_CONCAT(
        CONCAT(s.name, ' (', asv.duration, ' min)')
        ORDER BY s.name
        SEPARATOR ', '
    ) AS servicesSummary
FROM Appointment a
LEFT JOIN Client c ON a.clientID = c.clientID
LEFT JOIN AppointmentService asv ON a.appointmentID = asv.appointmentID
LEFT JOIN Service s ON asv.serviceID = s.serviceID
GROUP BY a.appointmentID
ORDER BY a.appointmentDate DESC, a.startTime DESC;