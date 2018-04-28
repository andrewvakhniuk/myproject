<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Ordering;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Ordering controller.
 *
 */
class OrderingController extends Controller
{

    public function datatableAjaxAction()
    {
        $em = $this->getDoctrine()->getManager();

        $data = $em->createQueryBuilder()
            ->select('
            orders.id, 
            orders.phone,
             CASE WHEN (orders.surname IS NULL) THEN orders.name ELSE CONCAT(orders.name,\' \',orders.surname)  END  as name,
              orders.email,
              DATE_FORMAT( orders.date, \'%Y-%M-%d %H:%i:%s\' )as date,
               orders.status,
                orders.city,
            orders.postOffice,
             orders.payed,
              orders.quantity,
              orders.price,
              orders.deliveryType,
              orders.paymentMethod,
               orders.ipAddress')
            ->from('AppBundle:Ordering', 'orders')
            ->getQuery()
            ->getArrayResult();
        $data['data'] = $data;
        $data['status'] = 'success';
        $data = json_encode($data, JSON_UNESCAPED_UNICODE);
        $response = new Response($data);
        $response->headers->set('Content-Type', 'application/json');
        $response->setCharset('utf-8');

        return $response;
    }

    /**
     * Lists all ordering entities.
     *
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

//        $data = $em->createQueryBuilder()
//            ->select('orders.id,orders.id, orders.phone, orders.name, orders.email,DATE_FORMAT( orders.date, \'%Y-%M-%d %H:%i:%s\' )as date, orders.status')
//            ->from('AppBundle:Ordering', 'orders')
//            ->getQuery()
//            ->getArrayResult();
//        $orderings = $em->getRepository('AppBundle:Ordering')->findAll();

        return $this->render('ordering/index.html.twig', array(
//            'orderings' => $orderings,
//            'data'=>$data,
        ));
    }

    /**
     * Creates a new ordering entity.
     *
     */
    public function newAction(Request $request)
    {
        $ordering = new Ordering();
        $form = $this->createForm('AppBundle\Form\OrderingType', $ordering);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($ordering);
            $em->flush();

            return $this->redirectToRoute('ordering_show', array('id' => $ordering->getId()));
        }

        return $this->render('ordering/new.html.twig', array(
            'ordering' => $ordering,
            'form' => $form->createView(),
        ));
    }

    /**
     * Finds and displays a ordering entity.
     *
     */
    public function showAction(Ordering $ordering)
    {
        $deleteForm = $this->createDeleteForm($ordering);

        return $this->render('ordering/show.html.twig', array(
            'ordering' => $ordering,
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Displays a form to edit an existing ordering entity.
     *
     */
    public function editAction(Request $request, Ordering $ordering)
    {
        $deleteForm = $this->createDeleteForm($ordering);
        $editForm = $this->createForm('AppBundle\Form\OrderingType', $ordering);
        $editForm->handleRequest($request);

        if ($editForm->isSubmitted() && $editForm->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('ordering_edit', array('id' => $ordering->getId()));
        }

        return $this->render('ordering/edit.html.twig', array(
            'ordering' => $ordering,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Deletes a ordering entity.
     *
     */
    public function deleteAction(Request $request, Ordering $ordering)
    {
        $form = $this->createDeleteForm($ordering);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($ordering);
            $em->flush();
        }

        return $this->redirectToRoute('ordering_index');
    }

    /**
     * @param Ordering $ordering
     * @return \Symfony\Component\Form\FormInterface
     */
    private function createDeleteForm(Ordering $ordering)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('ordering_delete', array('id' => $ordering->getId())))
            ->setMethod('DELETE')
            ->getForm();
    }

    public function messageAjaxAction(Request $request)
    {
        $form = $request->request->all();

        $message = (new \Swift_Message($form['name'] . ' Help Contact Service'))
            ->setFrom($form['email'])
            ->setTo('torofluxinfo@gmail.com')
            ->setBody('User Email: ' . $form['email'] . '<br> Message:<br>' .
                $form['message']
                .
                '<br><br>
                ip address:'.$request->getClientIp(), 'text/html'
            );
        $this->get('mailer')->send($message);

        return new JsonResponse($this->get('translator')->trans('contact.message_success'));
    }


    public function newAjaxAction(Request $request)
    {
        $ordering = new Ordering();
        $form = $this->createForm('AppBundle\Form\OrderingType', $ordering);

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $ordering->setDate(new \DateTime('now'));
            $ordering->setStatus('new');

            $em = $this->getDoctrine()->getManager();
            $em->persist($ordering);
            $em->flush();

            return new JsonResponse(['message' => $this->get('translator')->trans('order.success_message')]);
        }

        return $this->redirectToRoute('homepage');
    }

    public function changeStatusAjaxAction (Request $request)
    {
        $params = $request->request->all();
        $field = $params['field'];
        $value = $params['value'];

        $em = $this ->getDoctrine()->getManager();

        if(count($params['ids'])){
            $orderings = $em->createQueryBuilder()
                ->select('orderings')
                ->from('AppBundle:Ordering','orderings')
                ->where('orderings.id IN ('.implode(',',$params['ids']).')')
                ->getQuery()
                ->getResult();

            foreach ($orderings as $ordering){

                if($field === 'status'){
                    $ordering->setStatus($value);
                }else{
                    $ordering->setPayed($value === 'true');
                }
                $em->persist($ordering);
            }
            $em->flush();
        }
       return new JsonResponse(['status'=>'success']);
    }
}
