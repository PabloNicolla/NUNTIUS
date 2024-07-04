from django.shortcuts import get_object_or_404, render

# Create your views here.
from django.db.models import F
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.views import generic

from django.http import Http404
from django.template import loader

from .models import Choice, Question


# def index(request):
#     latest_question_list = Question.objects.order_by("-pub_date")[:5]
#     template = loader.get_template("polls/index.html")
#     context = {
#         "latest_question_list": latest_question_list,
#     }
#     return HttpResponse(template.render(context, request))

# def index(request):
#     latest_question_list = Question.objects.order_by("-pub_date")[:5]
#     context = {"latest_question_list": latest_question_list}
#     return render(request, "chat/index.html", context)


# There’s also a get_list_or_404() function, which works just as get_object_or_404() – except using filter() instead of get(). It raises Http404 if the list is empty.
# def detail(request, question_id):
#     try:
#         question = Question.objects.get(pk=question_id)
#     except Question.DoesNotExist:
#         raise Http404("Question does not exist")
#     return render(request, "polls/detail.html", {"question": question})


# def detail(request, question_id):
#     question = get_object_or_404(Question, pk=question_id)
#     return render(request, "chat/detail.html", {"question": question})


# def results(request, question_id):
#     question = get_object_or_404(Question, pk=question_id)
#     return render(request, "chat/results.html", {"question": question})

class IndexView(generic.ListView):
    # default template_name <app name>/<model name>_detail.html.
    # chat/question_detail.html
    template_name = "chat/index.html"
    context_object_name = "latest_question_list"

    def get_queryset(self):
        """Return the last five published questions."""
        return Question.objects.order_by("-pub_date")[:5]


class DetailView(generic.DetailView):
    model = Question
    template_name = "chat/detail.html"


class ResultsView(generic.DetailView):
    model = Question
    template_name = "chat/results.html"


def vote(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    try:
        selected_choice = question.choice_set.get(pk=request.POST["choice"])
    except (KeyError, Choice.DoesNotExist):
        # Redisplay the question voting form.
        return render(
            request,
            "chat/detail.html",
            {
                "question": question,
                "error_message": "You didn't select a choice.",
            },
        )
    else:
        selected_choice.votes = F("votes") + 1
        selected_choice.save()
        # Always return an HttpResponseRedirect after successfully dealing``
        # with POST data. This prevents data from being posted twice if a
        # user hits the Back button.

        # The reverse() function in the HttpResponseRedirect. This function helps avoid having to hardcode a URL in the view function.
        # It is given the name of the view that we want to pass control to and the variable portion of the URL pattern that points to that view.
        # In this case, using the URLconf , this reverse() call will return a string like "/chat/3/results/"
        return HttpResponseRedirect(reverse("chat:results", args=(question.id,)))
