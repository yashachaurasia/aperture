from django.http import JsonResponse
from .models import Field
from .recommendation import compute_status


def fields_list(request):
    fields = Field.objects.all().order_by("name")
    data = []
    for f in fields:
        status, explanation = compute_status(
            f.current_soil_moisture,
            f.stress_threshold,
            f.ideal_soil_moisture,
        )
        data.append({
            "id": f.id,
            "name": f.name,
            "current_soil_moisture": f.current_soil_moisture,
            "stress_threshold": f.stress_threshold,
            "ideal_soil_moisture": f.ideal_soil_moisture,
            "status": status,
            "explanation": explanation,
            "updated_at": f.updated_at.isoformat(),
        })
    return JsonResponse(data, safe=False)