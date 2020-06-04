export const formatCar = car => {
    const {
        year,
      make,
      model, 
      price
    } = car
    
    return `${year} ${make} ${model} $$${price}`
}