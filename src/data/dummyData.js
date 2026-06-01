export const initialUsers = [
  { id: 1, name: "Talha", email: "john@example.com", phone: "+1234567890", dob: "1990-03-14", status: "Active", joined: "2023-10-12", profilePic: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Hazair", email: "jane@example.com", phone: "+1234567891", dob: "1988-07-22", status: "Suspended", joined: "2023-11-05", profilePic: "https://i.pravatar.cc/150?img=2" },
  { id: 3, name: "Arhum", email: "sam@example.com", phone: "+1234567892", dob: "1995-11-04", status: "Active", joined: "2024-01-20", profilePic: "https://i.pravatar.cc/150?img=3" },
];

export const initialProjects = [
  { id: 1, title: "8-Bit Microprocessor", category: "Microprocessor Design", price: 99, difficulty: "Advanced", orders: 24 },
  { id: 2, title: "4-Bit ALU", category: "Combinational Circuits", price: 49, difficulty: "Intermediate", orders: 45 },
  { id: 3, title: "Traffic Light FSM", category: "Finite State Machines", price: 39, difficulty: "Beginner", orders: 120 },
  { id: 4, title: "UART Module", category: "Interface Protocols", price: 79, difficulty: "Advanced", orders: 15 },
];

export const initialOrders = [
  { id: 101, user: "Talha", project: "8-Bit Microprocessor", date: "2024-02-15", status: "Confirmed", amount: 99 },
  { id: 102, user: "Hazair", project: "Traffic Light FSM", date: "2024-02-14", status: "Pending", amount: 39 },
  { id: 103, user: "Arhum", project: "4-Bit ALU", date: "2024-02-13", status: "Cancelled", amount: 49 },
  { id: 104, user: "Abdullah", project: "UART Module", date: "2024-02-12", status: "Pending", amount: 79 },
];

export const salesData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 4500 },
  { name: "May", sales: 6000 },
  { name: "Jun", sales: 5500 },
];

export const categoryData = [
  { name: "Combinational", value: 400 },
  { name: "Sequential", value: 300 },
  { name: "FSM", value: 300 },
  { name: "Processor", value: 200 },
];