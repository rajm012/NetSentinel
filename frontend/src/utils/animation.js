// Smooth value animation helper
export function animateValue(start, end, duration) {
    return start + (end - start) * duration
  }
  
  // Animation frame helper
  export function animateOnUpdate(newValue, oldValue, setter, duration = 1000) {
    const startTime = Date.now()
    const startValue = oldValue || 0
  
    const animate = () => {
      const progress = Math.min(1, (Date.now() - startTime) / duration)
      const currentValue = animateValue(startValue, newValue, progress)
      setter(currentValue)
  
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setter(newValue) // Ensure final value is exact
      }
    }
  
    requestAnimationFrame(animate)
  }
  