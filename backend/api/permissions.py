from rest_framework import permissions

class IsSellerOrReadOnly(permissions.BasePermission):
    """
    Allow read to any. Modify only if user is the seller.
    """

    def has_object_permission(self, request, view, obj):
        # read-only allowed
        if request.method in permissions.SAFE_METHODS:
            return True
        # write permissions only to the seller
        return bool(request.user and obj.seller_id == request.user.id)
