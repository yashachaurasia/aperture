def compute_status(current, stress, ideal):
    """
    Determines field status based on agronomic thresholds.

    Three zones derived from Management Allowable Depletion (MAD) science:
      - Below stress_threshold: crop is under water stress (MAD exceeded)
      - Between stress and ideal: marginal — moisture is adequate but below target
      - At or above ideal: field is at target capacity, no action needed

    Source: Oklahoma State Ext. BAE-1537, Virginia Tech Ext. BSE-339
    """
    if current < stress:
        return (
            "Consider Irrigating",
            (
                f"Soil moisture ({current:.2f}) is below your stress threshold ({stress:.2f}). "
                "Your crop may already be experiencing water stress. "
                "Irrigation is recommended to avoid yield loss."
            ),
        )
    elif current < ideal:
        return (
            "Investigate",
            (
                f"Soil moisture ({current:.2f}) is above your stress threshold ({stress:.2f}) "
                f"but below your ideal level ({ideal:.2f}). "
                "Conditions are marginal — monitor closely and consider irrigating "
                "if moisture continues to decline."
            ),
        )
    else:
        return (
            "No Action Needed",
            (
                f"Soil moisture ({current:.2f}) is at or above your ideal level ({ideal:.2f}). "
                "Your field is well-watered. No irrigation needed at this time."
            ),
        )